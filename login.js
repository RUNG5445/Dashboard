document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("https://api.rungrueng.site/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                const expirationDate = new Date(Date.now() + 10 * 60 * 1000);

                document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie = "table=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

                if (data.message === "True") {
                    window.location.replace("admin.html");

                    document.cookie = `username=${username}; expires=${expirationDate.toUTCString()}; path=/;`;
                    document.cookie = `table=admin; expires=${expirationDate.toUTCString()}; path=/;`;
                    document.cookie = `id=1; expires=${expirationDate.toUTCString()}; path=/;`;
                } else {
                    window.location.replace("index.html");

                    document.cookie = `username=${data.username}; expires=${expirationDate.toUTCString()}; path=/;`;
                    document.cookie = `table=${data.table}; expires=${expirationDate.toUTCString()}; path=/;`;
                    document.cookie = `id=${data.id}; expires=${expirationDate.toUTCString()}; path=/;`;
                }
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
});
