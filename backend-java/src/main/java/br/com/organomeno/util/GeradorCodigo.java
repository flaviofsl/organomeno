package br.com.organomeno.util;

import java.util.Date;
import java.util.Random;

public class GeradorCodigo {

	public static Long gerar() {
		int maximo = 999;
		int minimo = 100;
		Random random = new Random();
		int numRadomico = random.nextInt((maximo - minimo) + 1) + minimo;
		String str = "";
		str = new Date().getTime() + "" + numRadomico;

		return Long.valueOf(str);
	}

}
