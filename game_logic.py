import random

def calcular_captura(capture_rate: int) -> bool:
    
    capture_rate = max(0, min(255, capture_rate))

    numero_sorteado = random.randint(0, 255)

    return numero_sorteado <= capture_rate