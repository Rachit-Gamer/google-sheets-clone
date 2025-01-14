# CDP Chatbot

A chatbot that answers "how-to" questions related to Customer Data Platforms (CDPs) such as **Segment**, **mParticle**, **Lytics**, and **Zeotap**. The chatbot leverages OpenAI's GPT-4 API for intelligent and context-aware responses.

---

## **Features**
1. **Core Functionalities**:
   - Handles "how-to" questions for each CDP.
   - Provides actionable guidance and steps based on documentation.

2. **Bonus Features**:
   - **Cross-CDP Comparisons**: Answer questions comparing features or approaches between CDPs.
   - **Advanced "How-to" Questions**: Address complex queries involving advanced configurations or integrations.

3. **ChatGPT-Like Interface**:
   - A user-friendly web interface with a modern design.

---

## **Dependencies**
The following dependencies are required for the project:

| Dependency      | Version   | Description                                    |
|------------------|-----------|------------------------------------------------|
| `express`       | ^4.21.2   | Web framework for building APIs.               |
| `axios`         | ^1.7.9    | HTTP client for API requests.                  |
| `dotenv`        | ^16.4.7   | Manages environment variables securely.        |
| `cors`          | ^2.8.5    | Enables cross-origin requests.                |
| `body-parser`   | ^1.20.3   | Parses incoming JSON request bodies.           |
| `fs` (built-in) | N/A       | Handles file operations in Node.js.           |
| `path` (built-in)| N/A      | Provides utilities for working with file paths.|
| `natural`       | ^8.0.1    | NLP library for tokenization and processing.   |
| `cheerio`       | ^1.0.0    | HTML parsing and web scraping.                 |
| `openai`        | ^4.78.1   | OpenAI SDK for GPT-4 integration.              |
| `nodemon`       | ^3.1.9    | Auto-restarts the server during development.   |

---

## **Setup Instructions**

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/cdp-chatbot.git
cd cdp-chatbot
