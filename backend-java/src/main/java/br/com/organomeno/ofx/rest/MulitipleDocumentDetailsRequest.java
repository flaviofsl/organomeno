package br.com.organomeno.ofx.rest;

import java.io.Serializable;
import java.util.List;

import jakarta.ws.rs.core.MediaType;
import org.jboss.resteasy.reactive.PartType;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

public class MulitipleDocumentDetailsRequest implements Serializable {

	private static final long serialVersionUID = 1L;

	@RestForm("fileUpload")
	private List<FileUpload> fileUpload;

	@RestForm("usuario")
	private String usuario;

//	@RestForm("fileDetails")
//	@PartType(MediaType.APPLICATION_JSON)
//	private List<FileDetails> fileDetails;

	public List<FileUpload> getFileUpload() {
		return fileUpload;
	}

	public void setFileUpload(List<FileUpload> fileUpload) {
		this.fileUpload = fileUpload;
	}

 	public String getUsuario() {
		return usuario;
	}
	public void setUsuario(String usuario) {
		this.usuario = usuario;
	}
}
