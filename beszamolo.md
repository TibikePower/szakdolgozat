# Féléves beszámoló a szakdolgozatról

*Csabai Tibor*

A szakdolgozat elkészítésénél az elsődleges szempont a számomra legmegfelelőbb konzulens kiválasztása volt. A nyár folyamán kerestem fel Piller Imre tanár urat azzal a kéréssel, hogy lenne-e a konzulensem. Nagy örömömre szolgált amikor igent mondott a kérésemre, viszont ekkor még nem volt konkrét témája a szakdolgozatomnak. Következő feladatunk tehát ebből adódóan megtalálni az ideális témát, amivel foglalkozni fogunk. Az elképzelésem egy webalkalmazás volt, de ekkor még kiforrottabb terveim nem voltak, viszont kiindulópontnak nem volt rossz. Végső soron a Monopoly játék stratégiáinak vizsgálatánál tettük le a voksunk, mely tartalmaz egy Monopoly webalkalmazást is.

Az első beszélgetéseink alkalmával szóba került a VueJS JavaScript keretrendszer, melyet akkoriban még nem ismertem. Néhány nap utánajárás után az volt a meglátásom, hogy szívesen megtanulnám magát a keretrendszert. Az alkalmazás kliens oldala tehát VueJS-t használ, a szerver oldal pedig NodeJS-t. A NodeJS-re szimplán azért esett a választás, mert már korábban is használtam, és megfelelő szinkronizációt nyújt a kliensek között.

Eleinte nem ment túl zökkenőmentesen a webalkalmazás fejlesztése, hiszen a különböző klienseknek egyidejűleg kellett kiszolgálni az adatokat a szervernek úgy, hogy ne legyen aszinkron. Erre a megoldást a socket.io jelentette számomra, amely gyorsan, aszinkron mentesen képes kapcsolatot teremteni a kliensek között a szerveren keresztül.

Miután a problémát sikerült eszközölni, fontos lépés volt átfutni magát a Monopoly szabályzatát, hogy tisztába legyek azzal hogy milyen feladatokat kell majd ellátnia az alkalmazásnak, és programozó látásmóddal megpróbálni átlátni.

Az alkalmazás megjelenítése a kliens számára mindezek mellett Bootstrap keretrendszert is használ, melynek segítségével sokkal egyszerűbben lehet a front-end részt fejleszteni. Viszont maga a monopoly tábla, amin a játékos bábuk, illetve játék mezők elhelyezkednek, HTML canvas-t használ. Mivel ezzel sem foglalkoztam korábban, meg kellett tanulnom az alapjait. Minél többet foglalkoztam vele, annál gördülékenyebben tudtam megvalósítani az elképzeléseimet. Eleinte négyzetekkel, pontokkal próbálkoztam, hogyan is lehetne azok pozícióit, méreteit változtatni akár interaktívan is. Miután magabiztosabb lettem, megvalósítottam önállóan a táblát, a választható bábukat, majd a canvas-ba helyeztem őket.

Az alkalmazás fejlesztése során mindig számíthatok konzulensem, Piller Imre segítségére ha esetleg elakadnék. Ha felhívja a figyelmem egy-egy hibára, vagy esetleg jobb megvalósítási módszerre, igyekszek eleget tenni neki. Szeptember óta nagyon sokat haladt előre véleményem szerint ez a projekt, és remélem hogy a továbbiakban is legalább ilyen tempóban tudunk haladni.
