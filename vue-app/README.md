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

*v0.20*

- Az ingatlanokat lehet fejleszteni

*v0.21*

- Az ingatlanokat visszalehet fejleszteni
- A játékos tud 5000 óvadékot fizetni, és kijönni a börtönből.
- Csak akkor tudja a játékos eladni az ingatlant, ha az ugyanolyan csoportban lévő ingatlanokon is (és az eladni kívánt ingatlanon is) a fejlesztési szint 0.

*v0.22*

- Ingatlanok elnevezve, kártyák elkészülve, eladási árak elkészülve.
- Kereskedés funkció fejlesztésének elkezdése.

*v0.23*

- Kereskedés funkció kész

*v0.24*

- Csőd kész

*TESZT UTÁNI JAVÍTÁSOK - 03.15.*

- Szolgáltató kártyákon átírva az ár a rendesre.
- Kijavítva az a hiba, hogy bármennyiszer dobhat duplát a játékos.
- A játékos neve előtt megjelenik a mező, ahol éppen áll.
- A táblára rákerült, hogy melyik mezőn melyik állat van.
- Ha valaki csődöt mond, automatikusan átadódik a kör.
- Ha valakinek minuszban van a pénze, úgy is tud kereskedni.
- Szerencsekártya lehetőségek kibővítve.

*v1.0a*

- Elkészült a játék befejezése. Ha két játékos csődöt mondott, automatikusan vége a játéknak. Összeszámolja a szerver az összegyűjtött értékeket, ezeket JF-ra váltja, és ezalapján felállít egy ranglistát.

*v1.1a*

- Bekerült az 1-es szintű bot a játékba, vele együtt egy Bot class is. 
- A server.js fájlban átrendezésre kerültek a függvények úgy, hogy a botok is tudják használni őket.

*v1.1.1a*

- Log class hozzáadva, ki-be lehet kapcsolni a logot (alapértelmezetten bevan kapcsolva).
- Felesleges console.log parancsok kivéve mindenhonnan.

*v1.2*

- A host tud új botokat hozzáadni a lobbyhoz a /addbot [szint] paranccsal.
- A host el tud távolítani botokat a lobbyból a /kickbot [név] paranccsal.
- 2-es szintű bot elérhető.

*v1.3*

- Az egyes szintű bot nem tud kereskedni.
- A kettes szintű bot sem képes a kereskedésre, viszon eltudja dönteni, hogy a neki tett ajánlatot elfogadja-e. Ő csak arra megy, hogy minél több pénze legyen.
- A kettes szintű bot tudja fejleszteni, illetve visszafejleszteni a telkeket
- Elkészültek a hármas szintű bothoz tartozó kereskedelem-elfogadás kiértékelő függvények

*v1.4*

- /botmode parancs, csak botok játszanak benne, megfigyelésre alkalmas.

*v1.4.1*

- Paraméterek átnevezve
- Paraméterek megadása egy objektummal történik
- botAction helyett calcBotNextAction

*v1.4.2*

- Bot származtatások : BotEasy -> BotMedium -> BotHard
- A szimuláció rész kiszedve a server.js-ből, átrakva a simulation.js-be.
- calcBotNextAction() szétszedve kisebb funkciókra.

**BOT SZINT: 1**
- Tud dobni a kockával (kezelve van a dupla dobás, illetve a háromszorosan is dupla dobás)
- Átadja a kört, ha nincs több teendője.
- Ha börtönbe kerül, feltudja használni az I.Sz.A.B. kártyáját, ha pedig van legalább X mennyiségű összege, kifizeti az óvadékot (Az X-et későbbiekben a bot szintje fogja befolyásolni).
- Csődöt tudnak mondani, ha minuszba vannak.

**BOT SZINT: 2**
- Tudnak szolgáltatókat/telkeket/bizniszeket venni.
- Amiket megvettek el is tudják adni hogyha minuszba megy a pénzük.
- Minden lehetséges dolgot megvesznek, amire éppen rálépnek.
- Eltudják dönteni, hogy elfogadják-e az ajánlatot (az emberi játékostól).
- Tudnak fejleszteni/bontani.

**BOT SZINT: 3**
- Be lehet állítani a paramétereiket
- Ezekkel fog történni a szimuláció

- Ajánlatot tehet egy telekre, ha már csak az az egy darab kell az egész csoporthoz.
- Paraméterezések megtörténtek.


https://docs.google.com/document/d/1o075qTjkNntUjh8flik7NT5SMN5RAtnK78QRJP4emeY/edit#heading=h.9cgvzx9llhrn