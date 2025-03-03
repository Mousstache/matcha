const User = require("./user");

(async () => {
    // 1️⃣ Créer la table
    await User.createTable();

    // 2️⃣ Ajouter un utilisateur
    const user = new User({ name: "Alice", age: 25 });
    await user.save();
    console.log("Utilisateur ajouté :", user);

    // 3️⃣ Récupérer tous les utilisateurs
    const users = await User.all();
    console.log("Tous les utilisateurs :", users);

    // 4️⃣ Trouver un utilisateur par nom
    const foundUser = await User.get({ name: "Alice" });
    console.log("Utilisateur trouvé :", foundUser);

    // 5️⃣ Mettre à jour un utilisateur
    if (foundUser) {
        await foundUser.update({ age: 30 });
        console.log("Utilisateur mis à jour :", foundUser);
    }

    // 6️⃣ Supprimer un utilisateur
    if (foundUser) {
        await foundUser.delete();
        console.log("Utilisateur supprimé !");
    }
})();