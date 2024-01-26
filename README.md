# Expense Monitor Web Application

This web application serves as a basic expense monitor, allowing users to add, visualize, and manage their expenses with good visual representation and also give  downlaod option. It follows a two-tier architecture with a backend implemented in Python using Flask and a frontend developed using HTML, CSS, and JavaScript with D3.js for data visualization.

## Features

- **Expense Management:** Users can add expenses with descriptions and amounts.
- **Expense Visualization:** Visualize expenses through interactive bar and pie charts and as well as for view there is expenses list.
- **Download Charts:** Users can download generated charts for offline use or sharing.

## How it Works

1. **Adding Expenses:** Users submit the expense form on the webpage, triggering the `addExpense()` function in the frontend JavaScript (`script.js`). This function sends a POST request to the backend `/add-expense` endpoint, storing the expense data on the server.

2. **Storing Data:** The Flask backend (`app.py`) receives the expense data from the POST request, appends it to the `expenses` list, effectively storing the new expense data in memory.

3. **Displaying Expenses:** The frontend fetches the list of expenses from the backend using a GET request to the `/expenses` endpoint. The fetched data is then displayed in a list format on the webpage.

4. **Visualizing Expenses:** Utilizing D3.js, the frontend dynamically renders visualizations of the expense data, providing insights into spending habits through bar and pie charts.

5. **Downloading Charts:** Users have the option to download the generated charts as SVG files for offline use or sharing. The frontend dynamically generates download links for the charts, allowing users to save them locally with a click.



## Setup Instructions

To set up and run the Expense Monitor web application using GitHub Codespaces, first create a codespace from your repository on GitHub. Once the codespace is created, clone the repository, navigate to the directory, and install dependencies Flask,Flask-CORS using pip. Then, start the Flask application by running python app.py in the terminal. Access the application through the provided URL in the codespace environment. From there, you can add expenses, visualize them with interactive charts, and download the charts for offline use. This setup allows for seamless development and testing of the application directly within the GitHub environment.
