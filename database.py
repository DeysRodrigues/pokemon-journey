import sqlite3

DB_PATH = "inventario.db"

def criar_tabela():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS inventario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pokemon_id INTEGER NOT NULL,
            nome TEXT NOT NULL,
            sprite TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()

def inserir_pokemon(pokemon_id: int, nome: str, sprite: str):
    conn = sqlite3.connect(DB_PATH)
    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO inventario (pokemon_id, nome, sprite) VALUES (?, ?, ?)",
            (pokemon_id, nome, sprite)
        )
        conn.commit()
    except sqlite3.Error as e:
        print(f"Erro ao inserir no banco: {e}")
        raise
    finally:
        conn.close()

def buscar_inventario():
    conn = sqlite3.connect(DB_PATH)
    try:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT pokemon_id AS id, nome, sprite AS imagem FROM inventario")
        linhas = cursor.fetchall()
        resultado = [dict(linha) for linha in linhas]
        return resultado
    except sqlite3.Error as e:
        print(f"Erro ao buscar inventário: {e}")
        raise
    finally:
        conn.close()