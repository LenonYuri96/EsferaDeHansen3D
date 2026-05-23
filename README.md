# 🧪 Esfera de Hansen 3D – Visualização Interativa para Cursos de Química

![Three.js](https://img.shields.io/badge/Three.js-r128-blueviolet)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![License](https://img.shields.io/badge/license-MIT-green)

> **Idealização:** Fausto de Souza Pagan (Eng. Químico)  
> **Desenvolvimento:** Lenon Yuri Silva

---

## 📌 Sobre o Projeto

Esta aplicação web foi desenvolvida para fins didáticos e industriais, permitindo a visualização tridimensional da **Esfera de Hansen** – um conceito fundamental na química de solubilidade. O usuário pode interagir com solventes e solutos em um ambiente 3D, compreendendo na prática os parâmetros de solubilidade de Hansen (δD, δP, δH).

O projeto é totalmente responsivo, possui alternância entre modo claro/escuro e conta com um sistema de "inteligência" que recomenda os solventes mais compatíveis com o soluto selecionado.

---

## ✨ Funcionalidades

- 🌐 **Visualização 3D interativa** da esfera de Hansen com eixos cartesianos e grades de referência.
- 🧪 **Cadastro dinâmico de solventes**: nome, parâmetros (δD, δP, δH) e cor personalizada.
- 🎯 **Definição do soluto** (ponto central da esfera) e raio da esfera de solubilidade.
- 📊 **Tabela interativa** com todos os solventes, distância de Hansen e indicação se estão dentro da esfera.
- 🖱️ **Clique para informações**: ao clicar em qualquer solvente (na cena 3D ou na tabela), um painel flutuante exibe seus detalhes.
- 🤖 **IA de recomendação**: ordena os solventes por distância de Hansen (do mais compatível ao menos compatível) e destaca o melhor candidato.
- 📄 **Exportação para PDF**: gera um relatório com a visualização 3D, parâmetros do soluto e tabela de solventes.
- 🌙 **Modo claro/escuro** com persistência da preferência no navegador.
- 📱 **Design responsivo** – funciona em desktops, tablets e smartphones.

---

## 🧠 Conceito – Parâmetros de Hansen

A Esfera de Hansen é uma representação tridimensional dos parâmetros de solubilidade:

- **δD (X)** – dispersão (forças de London)
- **δP (Y)** – polaridade
- **δH (Z)** – ligações de hidrogênio

A **distância de Hansen** entre um solvente e o soluto é calculada por:

$$
R_a = \sqrt{ (\delta D_s - \delta D_p)^2 + (\delta P_s - \delta P_p)^2 + (\delta H_s - \delta H_p)^2 }
$$

## Se \( R_a \leq R_0 \) (raio da esfera), o solvente é considerado **compatível**.

## 🛠️ Tecnologias Utilizadas

- [Three.js](https://threejs.org/) – renderização 3D
- [Bootstrap 5](https://getbootstrap.com/) – interface responsiva
- [Bootstrap Icons](https://icons.getbootstrap.com/) – ícones temáticos
- [html2canvas](https://html2canvas.hertzen.com/) + [jsPDF](https://github.com/parallax/jsPDF) – geração de PDF
- CSS3 com variáveis customizadas – temas claro/escuro

---
