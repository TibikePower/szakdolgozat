# Zoopoly alkalmazás

*v0.1*

- Bejelentkezési felület (felhasználónév megadása, karakter választása)
- Online felhasználók megjelenítése
- Chat funkció (szervertől érkező üzenetekre is alkalmas)
- Bejelentkezés utáni várakozó felület, amíg a kijelölt host el nem indítja a játékot (a kinézet még nincs kész)
- A kijelölt host játékos tud különböző parancsokat használni, ha beírja őket a chatbe / jellel
- Monopoly tábla 80%-ban elkészült
- Több választható karakter
- Dobás illetve Új kör gombok
- A karakterek tudnak lépni a táblán, a dobott számnak megfelelően (ellenőrizve hogy duplán dobott-e)
- Csak az tudja használni a gombokat, aki az éppen aktuális körben soron van

*v0.11*

- Könnyű / Közepes / Nehéz bot hozzáadása/kickelése parancsok (a játékban még nem működnek) - (Ez egyelőre kivéve)
- Elkészült a börtön (még 2 gombot kell berakni, hogy azokkal is kilehessen szabadulni de cask dobással)
- favicon lecserélve
- Ha valaki azután akarna csatlakozni hogy már megvan a 4 játékos/bot vagy elindult a játék, már nem tud csatlakozni

*v0.12*

- A tábla közepe készen lett
- Elkezdődik a program átírása úgy, hogy objektum orientált legyen

*v0.13*

- Foreach-ek átírva for-okra
- Player konstruktorban kevesebb paraméter

*v0.13.1*

- Classok átgondolva, nagyjából így fog kinézni az alap játék

*v0.14*

- Bizniszek megvásárolhatók
- Ha egy másik játékos rálép a bizniszre ellenőrizve van hogy mennyi biznisszel rendelkezik a játékos
- Telkek megvásárolhatóak
- Ha egy másik játékos rálép a telekre ellenőrzi hogy milyen upgrade van a telken
- Áram/vízszolgáltatók is megvásárolhatók, fizetés is megcsinálva

*v0.15*

- Kijavítva a telek vétel, a nem telek mezőkre nem ajánlja fel, hogy meglehet venni
- Adó, Szerencsekártya, Szolgáltatók, Bizniszek, Ingyen Parkoló, Börtön(látogató+irány a börtön) kártyák photoshop fájljai elkészültek
- A táblára felkerültek hogy mennyibe kerülnek az adott telkek (még csak ps fájl)
- Megjelenítődik hogyha a játékos rendelkezik "Ingyen szabadulhatsz a börtönből" kártyával.

*v0.16*

- Szerencsekártya funkció készen van, már csak a hozzátartozó szövegeket kell megcsinálni.
- A mezők kis kártyái megvannak csinálva, kivéve a telkeké mert azoknak még ki kell találni a nevüket.

*v0.17*

- Ha játék közben rákattint valaki a játékos nevére kilistázza hogy milyen telkekkel, szolgáltatókkal, bizniszekkel rendelkezik. (Képekkel)

*v0.18*

- A táblán látszanak a telekfejlesztések a fejlesztésnek megfelelően.
- Mostantól lehet használni az 'Ingyen szabadulhatsz a börtönből' kártyát.

*v0.19*

- A már megvásárolt dolgokat eltudja adni a játékos a banknak, ha egy másik játékos rálép az eladott mezőre megtudja vásárolni.

// Fejlesztéseket kell megcsinálni + ha eladja a cuccokat bekell árazni őket