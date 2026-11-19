# Studio Pilates LOUISE KARLA — Integração Firebase

## Estrutura do Pacote
- `firebase.json` — Configuração do Firebase Hosting e Firestore.
- `.firebaserc` — Vinculação direta ao projeto `studioapilates-86b2f`.
- `firestore.rules` — Regras de leitura e gravação no banco Firestore.
- `firestore.indexes.json` — Índices do Firestore.
- `public/firebase-config.js` — Inicialização do Firebase SDK `13.4.0` (App, Analytics e Firestore com cache offline e sincronização em tempo real).
- `public/index.html` — Ponto de entrada da aplicação integrado ao módulo Firebase.

## Como publicar (Deploy)
1. Instale a CLI do Firebase (caso ainda não tenha):
   ```bash
   npm install -g firebase-tools
   ```
2. Faça login na sua conta Google:
   ```bash
   firebase login
   ```
3. Na pasta extraída deste ZIP, envie para o Firebase Hosting e Firestore:
   ```bash
   firebase deploy
   ```

## Como conectar ao seu arquivo HTML completo
1. Substitua o conteúdo de `public/index.html` pelo seu arquivo `studio_pilates_ocupacao (5).html`.
2. Antes do fechamento de `</body>`, adicione:
   ```html
   <script type="module">
     import { syncLoadFromCloud, syncSaveToCloud } from "./firebase-config.js";

     // Sincroniza ao abrir o app
     syncLoadFromCloud("studio_pilates_louise_karla_v2", (remoteDb) => {
       if (typeof load === "function" && typeof render === "function") {
         window.db = load();
         render();
       }
     });

     // Intercepta o save() local para espelhar automaticamente no Firestore
     const _origSave = window.save;
     if (typeof _origSave === "function") {
       window.save = function () {
         const ok = _origSave.apply(this, arguments);
         if (ok && window.db) syncSaveToCloud(window.db);
         return ok;
       };
     }
   </script>
   ```
