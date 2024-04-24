package br.com.organomeno.util;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

public class DataUtil {

	public static int getCurrentMonth() {
		Calendar cal = GregorianCalendar.getInstance();
		cal.setTime(new Date());
		int mes = (cal.get(Calendar.MONDAY) + 1);
		return mes;

	}

	public static int getCurrentYear() {
		Calendar cal = GregorianCalendar.getInstance();
		cal.setTime(new Date());
		int ano = cal.get(Calendar.YEAR);
		return ano;

	}

	public static Date getFirstDayOfTheMonth() {
		Calendar cal = GregorianCalendar.getInstance();
		cal.setTime(new Date());
		cal.set(Calendar.DAY_OF_MONTH, 1);
		Date data = cal.getTime();
		System.out.println(new SimpleDateFormat("dd/MM/yyyy").format(data));
		return data;
	}

	public static Date getDate(int dia, int mes, int ano) {
		System.out.println("getDate");
		Calendar cal = GregorianCalendar.getInstance();
		cal.set(ano, (mes - 1), dia);
		Date data = cal.getTime();
		System.out.println(new SimpleDateFormat("dd/MM/yyyy").format(data));
		return data;
	}
	
	public static Date getFirstDayOfTheMonth(int mes, int ano) {

		Calendar cal = GregorianCalendar.getInstance();
		cal.setTime(new Date());
		cal.set(ano, (mes - 1), 1);
		Date data = cal.getTime();
		System.out.println(new SimpleDateFormat("dd/MM/yyyy").format(data));
		return data;
	}

	public static Date getLastDayOfTheMonth() {
		Calendar cal = GregorianCalendar.getInstance();
		cal.setTime(new Date());
		int ultimoDiaDoMes = cal.getActualMaximum(Calendar.DAY_OF_MONTH);
		cal.set(Calendar.DAY_OF_MONTH, ultimoDiaDoMes);
		Date data = cal.getTime();
		System.out.println(new SimpleDateFormat("dd/MM/yyyy").format(data));
		return data;
	}

	public static Date getLastDayOfTheMonth(int mes, int ano) {
		Calendar cal = GregorianCalendar.getInstance();
		cal.setTime(new Date());
		cal.set(ano, (mes - 1), 1);
		int ultimoDiaDoMes = cal.getActualMaximum(Calendar.DAY_OF_MONTH);
		cal.set(Calendar.DAY_OF_MONTH, ultimoDiaDoMes);
		Date data = cal.getTime();
		System.out.println(new SimpleDateFormat("dd/MM/yyyy").format(data));
		return data;
	}
}
