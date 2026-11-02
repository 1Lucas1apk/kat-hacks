# KAT-OS // painel de debug do KAT

Jogo: https://coratech-projects.github.io/KAT/

mexendo em um jogo que usa portugol nas interações e sinceramente deu uma dor na alma ter que lidar com aquilo dkskksks misericórdia

no fim acabei fazendo um hack pra modificar alguns atributos do jogo, tipo velocidade de movimento, noclip, tamanho do personagem e outras coisas, que inicialmente eram só alterações pelo console mas acabou virando um painel próprio

---

## o que tem de novo

**visual nativo do jogo**

resolvi fazer a interface seguindo a aparência original do KAT, usando as próprias cores do jogo

- paleta original (`--pixel-highlight: #e0b8ff`, `--pixel-panel: #241432` e degradê entre `#322044` e `#170e22`)
- bordas duplas pixeladas seguindo as caixas de diálogo
- fonte `Courier New`
- aparência de um menu secreto de desenvolvedor, como se fosse um terminal de root do próprio jogo

**persistência entre cenários**

uma coisa que incomodava era o script desaparecer quando mudava de cenário ou passava por um portal

agora ele salva as configurações no `localStorage` e tenta restaurar tudo quando o jogo carrega novamente

configurações salvas:

- `Speed`
- `Noclip`
- `Godzilla`
- `Pião`
- estado minimizado do painel

também adicionei a opção de minimizar, que transforma o painel em um pequeno indicador no canto da tela

`[ KAT-OS // ROOT ]`

assim não fica atrapalhando enquanto joga

---

## instalação automática

pra não precisar executar o código pelo console toda vez, dá pra usar Tampermonkey ou Violentmonkey

[Tampermonkey](https://www.tampermonkey.net/)

depois de instalar:

- abra o dashboard da extensão
- crie um novo script
- apague o conteúdo padrão e cole o conteúdo de `kat-hack.user.js`
- salve com `Ctrl + S`

depois é só abrir o jogo

https://coratech-projects.github.io/KAT/

o script carrega automaticamente e tenta manter as configurações mesmo quando você troca de cenário ou passa por portais

---

## arquivos

- `kat-hack.user.js` — versão para Tampermonkey, com carregamento automático
- `kat-hack.js` — versão avulsa para executar pelo console do navegador (`F12`)
- `bookmarklet.txt` — versão compactada para salvar nos favoritos e executar com um clique