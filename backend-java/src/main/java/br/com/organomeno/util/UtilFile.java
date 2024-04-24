package br.com.organomeno.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;

public class UtilFile {

	static public boolean arquivoPossuiTexto(File arquivo, String texto) throws IOException {

		boolean result = false;
		BufferedReader reader = new BufferedReader(new FileReader(arquivo));
		String linha;
		while ((linha = reader.readLine()) != null) {
			if (linha.contains(texto)) {
				result = true;
			}

		}
		reader.close();
		return result;

	}

	public static void changeEncoding(File source, String srcEncoding, File target, String tgtEncoding)
			throws IOException {
		try (BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(source), srcEncoding));
				BufferedWriter bw = new BufferedWriter(
						new OutputStreamWriter(new FileOutputStream(target), tgtEncoding));)

		{
			char[] buffer = new char[16384];
			int read;
			while ((read = br.read(buffer)) != -1)
				bw.write(buffer, 0, read);
		}
	}
	
	public static void copyFileUsingStream(InputStream input, File dest) throws IOException {
	    InputStream is = input;
	    OutputStream os = null;
	    try {
	        os = new FileOutputStream(dest);
	        byte[] buffer = new byte[1024];
	        int length;
	        while ((length = is.read(buffer)) > 0) {
	            os.write(buffer, 0, length);
	        }
	    } finally {
	        is.close();
	        os.close();
	    }
	}
}
