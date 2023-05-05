# Bakalářská práce

**Autor**: Radomír Čech (CEC0144)

**Datum poslední úpravy**: 29.4.2023

**O co se jedná?** Jedná se o webovou aplikaci, která využívá framework Django jako backend. Tento backend si uchovává koronavirová data a stará se o jejich aktuálnost. Data předává frontendu (klientovi), který data vizualizuje.

**Jak program zprovoznit?** Existují tři způsoby:
1. Ručně nainstalovat Django:
    - nainstalovat Django a jiné balíčky přes pip (``pip install Django apscheduler``)
    - přejít do adresáře Django projektu (adresář 'django', kde se nachází soubor manage.py)
    - spusit aplikaci pomocí ``python3 manage.py runserver``
    - bude spuštěn lokální testovací server, na který lze přistoupit na adrese http://127.0.0.1:8000/covid/
2. Použít přibalený Dockerfile (Linux)
    - nainstalovat prostředí příkazem ``docker build -t cec0144_thesis .``
    - spustit příkazem ``docker run -p 8000:8000 cec0144_thesis:latest``
    - jakmile se aplikace spustí (trvá přibližně minutu), bude aplikace dostupná na adrese http://127.0.0.1:8000/covid/
3. Využít bezplatný hosting - **UPOZORNĚNÍ**
    - **tento hosting má omezené hardwarové zdroje**, takže doporučuji stahovat maximum 300-400 dní, při pokusu o stažení více dat je vysoce pravděpodobné, že aplikaci dojde paměť a restartuje se
    - aplikace je hostována na hostingu Northflank, je dostupná na adrese https://p02--thesis-covid--k4spvy25x5nv.code.run/covid/
    - tím, že jsou na hostingu omezené hardwarové zdroje, tak trvá delší dobu stažení dat

**Připomínky k aplikaci:**
- spuštění aplikace po delší době nepoužívání chvíli trvá - při startu se aktualizují koronavirová data (např. po měsíci nepoužívání může spuštění trvat i pár minut než se stáhnou všechna data)
- může se stát, že při pokusu o stažení velkého počtu dní (po delší době nepoužívání) dojde k zablokování přístupu k API MZČR, stačí vyčkat pár minut a spustit aplikaci znovu, bude ve stahování pokračovat
- ve virtuálním počítači občas zlobí mapa (špatně se přibližuje a oddaluje)
- na prohlížeči Firefox je omezeno pár funkcí (prozatím se jedná pouze o škálování GUI) 

GeoJSON mapa byla vytvořena ve spolupráci s Carlosem Moreira, který mi umožnil použít jeho GeoJSON model České republiky rozdělené na okresy. Mapa podléhá GNU GPL licenci.

Ukázky:
![Screenshot](https://i.imgur.com/fJX4TPa.jpg)
![Screenshot](https://i.imgur.com/xJLzfW7.jpg)
