# Studyaid
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>StudyMore - Site d'Étude</title>
<style>
    body {
        font-family: 'Arial', sans-serif;
        background-color: #D2B48C; /* Light brown */
        margin: 0;
        padding: 0;
    }
    header {
        background-color: #A0522D;
        color: white;
        text-align: center;
        padding: 1rem 0;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    header h1 { margin: 0; font-size: 2rem; }
    nav {
        display: flex;
        justify-content: center;
        gap: 1rem;
        background-color: #C68642;
        padding: 0.5rem 0;
    }
    nav a {
        color: white;
        text-decoration: none;
        font-weight: bold;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        transition: 0.3s;
    }
    nav a:hover { background-color: #8B4513; }

    .search-container {
        text-align: center;
        margin: 1rem 0;
    }
    .search-container input {
        width: 80%;
        max-width: 400px;
        padding: 0.5rem;
        border-radius: 5px;
        border: 1px solid #8B4513;
    }

    section {
        padding: 2rem;
        margin: 1rem auto;
        max-width: 1200px;
        background-color: rgba(255,255,255,0.85);
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        position: relative;
    }
    section::before {
