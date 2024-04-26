package br.com.organomeno.ofx.rest;

public class FileDetails {
	private String name;
	private String description;
	private String absolutePath;
	private String comments;
	private String mimeType;
	private String version;

	public FileDetails() {
		super();
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getAbsolutePath() {
		return absolutePath;
	}

	public void setAbsolutePath(String absolutePath) {
		this.absolutePath = absolutePath;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public String getMimeType() {
		return mimeType;
	}

	public void setMimeType(String mimeType) {
		this.mimeType = mimeType;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("FileDetails [name=");
		builder.append(name);
		builder.append(", description=");
		builder.append(description);
		builder.append(", absolutePath=");
		builder.append(absolutePath);
		builder.append(", comments=");
		builder.append(comments);
		builder.append(", mimeType=");
		builder.append(mimeType);
		builder.append(", baseVersion=");
		builder.append(version);
		builder.append("]");
		return builder.toString();
	}

}