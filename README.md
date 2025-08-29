# **Digital Marketplace**

A project for **CPSC 471** focused on creating an interface for used clothing items to be sold by resellers and bought by buyers, looked over by a middleman. 
Please refer to the diagrams_and_user_manual.pdf for a step-by-step walkthrough of how the project works, including the system architecture, data flow diagrams, and a usage demonstration. This document provides both the technical overview and a user-friendly guide to replicate the demo.
---

## **Group Members: Group 26**

- **Anthony Tolentino**
- **Arcleah Pascual**
- **Tyler Nguyen**

---

## **How to Run**

Follow these steps to set up and run the project locally:

- git clone https://github.com/arcleah/digitalmarketplace.git
- cd backend
- npm i express mysql nodemon
- npm i axios
- npm i cors
- npm i react-router-dom
- npm start

- cd client
- npm i
- npm start

mySQL workbench setup:
- data import resellstoreddb.sql
- run query: ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'cpsc471';

