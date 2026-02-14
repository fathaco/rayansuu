# إعداد تسجيل الدخول بغوغل (Supabase)

## Erreur 400 : redirect_uri_mismatch

Si Google affiche **« redirect_uri_mismatch »**, c’est que l’URI de redirection envoyée par Supabase n’est pas enregistrée dans Google Cloud Console.

**À faire dans Google Cloud Console :**

1. Ouvrez [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials**.
2. Cliquez sur votre **OAuth 2.0 Client ID** (type « Web application »).
3. Dans **Authorized redirect URIs**, ajoutez **exactement** cette URL (sans espace, sans slash final) :
   ```
   https://oewjkqqrnksghjrowyth.supabase.co/auth/v1/callback
   ```
4. Cliquez sur **Save**.

**Important :**  
- C’est l’URL de **Supabase** (pas votre site) que Google doit autoriser.  
- Ne mettez **pas** `http://localhost:3000` ou l’URL de votre app dans les redirect URIs de Google pour ce flux ; elles se configurent dans Supabase (URL Configuration).

Après avoir enregistré, attendez 1–2 minutes et réessayez la connexion.

---

## 1. Google Cloud Console

- Dans [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials** :
  - Utilisez un client OAuth 2.0 de type **« Web application »** (ou créez-en un).
  - Dans **Authorized redirect URIs**, ajoutez **uniquement** :
    - `https://oewjkqqrnksghjrowyth.supabase.co/auth/v1/callback`
  - Pas de slash à la fin, pas d’autre URI pour ce flux Supabase/Google.

## 2. Supabase Dashboard

1. [Supabase Dashboard](https://supabase.com/dashboard) → votre projet → **Authentication** → **Providers**.
2. Activez **Google** et renseignez :
   - **Client ID :** `1048092196899-ppjp2sr5b74u3mhls8vmoj82l1u03jkn.apps.googleusercontent.com`
   - **Client Secret :** `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`
3. Dans **Authentication** → **URL Configuration** :
   - **Site URL :** l’URL de votre site (ex. `https://votredomaine.com` ou en dev `http://127.0.0.1:3000`).
   - **Redirect URLs :** ajoutez par exemple `http://127.0.0.1:3000/**` et `https://votredomaine.com/**` selon votre environnement.

Une fois sauvegardé, le bouton « تسجيل الدخول بغوغل » doit fonctionner et l’utilisateur peut voir ses réservations après connexion.

**Note :** Ne mettez pas le Client Secret dans le fichier `.env` du projet ; il doit rester dans le dashboard Supabase uniquement.
