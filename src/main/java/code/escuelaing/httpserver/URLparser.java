/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package code.escuelaing.httpserver;

import java.net.*;
/**
 *
 * @author maria.sanchez-m
 */
public class URLparser {
    public static void main(String[] args)throws Exception{
        URL primerurl = new URL("http://arep.escuelaing.edu.co:80/urlparser/index.html?val=3&color=rojo#publicaciones");
        System.out.println("protocol = " + primerurl.getProtocol());
        System.out.println("authority = " + primerurl.getAuthority());
        System.out.println("host = " + primerurl.getHost());
        System.out.println("port = " + primerurl.getPort());
        System.out.println("path = " + primerurl.getPath());
        System.out.println("query = " + primerurl.getQuery());
        System.out.println("filename = " + primerurl.getFile());
        System.out.println("ref = " + primerurl.getRef());
    }
    
}
