/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */
package code.escuelaing.httpserver;

import java.net.*;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author maria.sanchez-m
 */
public class Httpserver {
    private static final int port = 35000;
    private static String directory = "webroot";
    private static final Map<String, String> dataStore = new HashMap<>();
    
    public static void main(String[] args) throws IOException, URISyntaxException {
        findWebRoot();
        ServerSocket serverSocket = null;
        try {
            serverSocket = new ServerSocket(35000);
        } catch (IOException e) {
            System.err.println("Could not listen on port: 35000.");
            System.exit(1);
        }
        Socket clientSocket = null;
       
        boolean running = true;
        while (running){

            try {
                System.out.println("Listo para recibir ...");
                clientSocket = serverSocket.accept();
                handleRequestClient(clientSocket);
            } catch (IOException e) {
                System.err.println("Accept failed.");
                System.exit(1);
            }
        }
        serverSocket.close();
    }

    private static void findWebRoot() {
        String currentDir = System.getProperty("user.dir");
        System.out.println("📂 Directorio actual: " + currentDir);
        
        String[] possiblePaths = {
            "webroot",
            "../webroot",
            "../../webroot", 
            "./webroot",
            currentDir + "/webroot",
            "src/main/resources",
        };
        
        for (String path : possiblePaths) {
            File webRootDir = new File(path);
            if (webRootDir.exists() && webRootDir.isDirectory()) {
                directory = path;
                System.out.println("✅ Webroot encontrado en: " + webRootDir.getAbsolutePath());
                return;
            }
        }
        
        System.out.println("⚠️ No se encontró webroot, usando: " + directory);
    }

    public static void handleRequestClient(Socket clientSocket) {
        try (BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream())); PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true); BufferedOutputStream dataOut = new BufferedOutputStream(clientSocket.getOutputStream())) {

            String requestLine = in.readLine();
            if (requestLine != null) {
                String[] tokens = requestLine.split(" ");
                String method = tokens[0];
                String fileRequested = tokens[1];

                if (fileRequested.equals("/")) {
                    fileRequested = "/index.html";
                }

                if (method.equals("GET")) {
                    handleGetRequest(fileRequested, dataOut, out);
                } else if (method.equals("POST")) {
                    handlePostRequest(in, fileRequested, out);
                }
            }
        } catch (IOException e) {
        }
    }

    private static void handleGetRequest(String fileRequested, BufferedOutputStream dataOut, PrintWriter out) {
        if (fileRequested.startsWith("/api/hello")) {
            String savedName = dataStore.getOrDefault("name", "usuario");
            String savedApellido = dataStore.getOrDefault("apellido", "");
            String queryParams = fileRequested.split("\\?").length > 1 ? fileRequested.split("\\?")[1] : "";
            String[] params = queryParams.split("&");

            for (String param : params) {
                if (param.startsWith("name=")) {
                    String name = param.split("=")[1];
                    try {
                        name = URLDecoder.decode(name, "UTF-8");
                    } catch (UnsupportedEncodingException e) {
                    }
                    dataStore.put("name", name);
                    savedName = name;
                }
            }

            String jsonResponse;
            if (!savedApellido.isEmpty() && !savedApellido.equals("Apellido")) {
                jsonResponse = "{\"name\": \"" + savedName + "\", \"apellido\": \"" + savedApellido + "\"}";
            } else {
                jsonResponse = "{\"name\": \"" + savedName + "\"}";
            }

            out.println("HTTP/1.1 200 OK");
            out.println("Content-Type: application/json");
            out.println("Content-Length: " + jsonResponse.length());
            out.println();
            out.print(jsonResponse);
            out.flush();
            return;
        }

        File file = new File(directory, fileRequested);

        if (file.exists() && !file.isDirectory()) {
            try {
                String contentType = getType(fileRequested);
                long fileLength = file.length();

                out.println("HTTP/1.1 200 OK");
                out.println("Content-Type: " + contentType);
                out.println("Content-Length: " + fileLength);
                out.println();
                out.flush();

                FileInputStream fileInputStream = new FileInputStream(file);
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = fileInputStream.read(buffer)) != -1) {
                    dataOut.write(buffer, 0, bytesRead);
                }
                dataOut.flush();
                fileInputStream.close();
            } catch (IOException e) {
            }
        } else {
            out.println("HTTP/1.1 404 Not Found");
            out.println("Content-Type: text/html");
            out.println();
            out.println("<html><body><h1>404 - File not found</h1></body></html>");
        }
    }

    private static void handlePostRequest(BufferedReader in, String fileRequested, PrintWriter out) {
        if (fileRequested.equals("/api/updateName")) {
            try {
                String line;
                int contentLength = 0;

                while (!(line = in.readLine()).isEmpty()) {
                    if (line.startsWith("Content-Length:")) {
                        contentLength = Integer.parseInt(line.split(":")[1].trim());
                    }
                }

                String apellido = "Apellido";

                if (contentLength > 0) {
                    char[] body = new char[contentLength];
                    in.read(body, 0, contentLength);
                    String requestBody = new String(body);

                    if (requestBody.contains("\"apellido\"")) {
                        String[] parts = requestBody.split("\"apellido\"\\s*:\\s*\"");
                        if (parts.length > 1) {
                            String namePart = parts[1];
                            int endQuote = namePart.indexOf("\"");
                            if (endQuote > 0) {
                                apellido = namePart.substring(0, endQuote);
                            }
                        }
                    } else if (requestBody.contains("\"name\"")) {
                        String[] parts = requestBody.split("\"name\"\\s*:\\s*\"");
                        if (parts.length > 1) {
                            String namePart = parts[1];
                            int endQuote = namePart.indexOf("\"");
                            if (endQuote > 0) {
                                apellido = namePart.substring(0, endQuote);
                            }
                        }
                    }

                    dataStore.put("apellido", apellido);
                }

                String responseMessage = "{\"mensaje\": \"Apellido actualizado: " + apellido + "\"}";

                out.println("HTTP/1.1 200 OK");
                out.println("Content-Type: application/json");
                out.println("Content-Length: " + responseMessage.length());
                out.println();
                out.print(responseMessage);
                out.flush();

            } catch (IOException e) {
            }
        }
    }

    private static String getType(String fileRequested) {
        String extension = getFileExtension(fileRequested);

        if (extension.equals("html")) {
            return "text/html; charset=utf-8";
        }
        if (extension.equals("css")) {
            return "text/css; charset=utf-8";
        }
        if (extension.equals("js")) {
            return "application/javascript; charset=utf-8";
        }
        if (extension.equals("png")) {
            return "image/png";
        }
        if (extension.equals("jpg") || extension.equals("jpeg")) {
            return "image/jpeg";
        }
        return "application/octet-stream";
    }

    private static String getFileExtension(String fileRequested) {
        int dotIndex = fileRequested.lastIndexOf('.');
        if (dotIndex == -1) {
            return "";
        }
        return fileRequested.substring(dotIndex + 1).toLowerCase();
    }

    public static Map<String, String> getDataStore() {
        return dataStore;
    }
}