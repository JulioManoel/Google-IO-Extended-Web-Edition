# Google I/O Extended Web Edition - Sorocaba

Este repositório contém código finalizado do evento Google I/O Extended Web Edition sobre a Plataforma Google Maps, onde foi desenvolvido um mapa 3d utilizando API do Google Maps, WebGL, THREE e node.js.

## Pré-Requisitos
- Conta Google Cloud Patform com o faturamento ativo
- Editor de Texto.
- [Node.js] instalado

## Começando
1. Primeiramente execute o comando `npm install` na pasta `/starter`.
2. Logo após execute `npm start` no mesmo diretorio.
3. Em seguida ative todas as [API do Google Maps].
4. Insira sua apiKey no arquivo `/starter/app.js` no objeto `apiOptions`.
5. Gere um mapa do tipo JavaScript nas opções JavaScript escolha Vector, Tilt e Rotation.

<img src="/img/mapid_gen.png" alt="Gerando Mapa" width="500">

6. Insira sua Map ID gerada no arquivo `/starter/app.js` no objeto `mapOptions`.

<img src="/img/map_details.png" alt="Gerando Mapa" width="500">


[Node.js]: https://nodejs.org/pt-br/
[API do Google Maps]: https://developers.google.com/maps/gmp-get-started#enable-api-sdk