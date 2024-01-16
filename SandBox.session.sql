CREATE TABLE IF NOT EXISTS hello (
	id integer PRIMARY KEY AUTOINCREMENT,
	perfil_id integer NOT NULL,
	titulo varchar(50) NOT NULL,
	subtitulo varchar(50) NOT NULL,
	tituloBotao varchar(50) NOT NULL,
	urlBotao varchar(100) NOT NULL
)