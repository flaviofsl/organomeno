package br.com.organomeno.util;

/**
 * Muitas exece��es s�o decorrentes de outras exece��es
 * esta classe auxilia em pegar a mensagem da exece��o de mais baixo nivel
 * @author Solimar Silva e Silva
 */

public class UtilErros {	
	public static String getMensagemErro(Exception e){
		
		while (e.getCause() != null){
			e = (Exception) e.getCause();
		}
		String retorno = e.getMessage();
		
		return retorno;
	}

}
