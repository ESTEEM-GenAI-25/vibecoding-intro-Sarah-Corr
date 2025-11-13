<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1H1vEJeZAe3ku5eWUbAjB2zDvtNcKp-yj

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


Read Me File:
StyleSync - AI-Powered Outfit Assistant

This project is a simple web application that helps users create outfits from their real wardrobe. Users can upload clothing images, set their daily context (mood, occasion, weather), and receive AI-generated outfit suggestions. There is also a shopping assistant that recommends new clothing items based on the user’s needs.

This repository contains everything needed to view, run, and understand the project.

Project Overview and Purpose

The purpose of this project is to demonstrate how generative AI can be used inside a simple, user-facing app built with Google AI Studio. StyleSync helps users decide what to wear by allowing them to upload images of their clothes and then using AI to suggest outfits based on the context of their day.

The app includes three main sections:

My Wardrobe - Users upload pictures of clothing items and optionally add tags or categories.

Today’s Context - Users select their mood, occasion, and weather.

AI Outfit Feed & Shop Assist - The AI generates an outfit using the uploaded wardrobe images and can also recommend new items to buy.

This demonstrates a basic but practical use of AI to support everyday decision-making.

AI Component Explanation
What the AI Does
The app uses Google’s Gemini model to perform two tasks:

Outfit Generation

Input: The user’s uploaded clothing images and their selected context (mood, occasion, weather).

Output: A short explanation of an outfit using items from the wardrobe. The AI describes why certain pieces go together and provides a suggested overall look.

Shopping Recommendations

Input: A short text description of what the user feels they need (e.g., “I need more professional clothes”).

Output: A set of item recommendations of what to buy such as blazers, trousers, or shoes, with a brief explanation for each including what items in the users current wardrobe they would match.

Why This AI Approach Was Chosen

These tasks were selected because they match a realistic use case for generative AI: producing helpful, personalized suggestions based on user inputs. The tasks are simple, clearly defined, and easy to evaluate. They also show how AI can interpret images, text, and context to generate creative but grounded recommendations.

Using Gemini allowed the app to handle both image understanding and text generation in one model, which simplifies the implementation.

How the AI Supports the Product’s Goal

The goal of StyleSync is to help users make outfit decisions faster and with more confidence. The AI improves the overall experience by:

Interpreting clothing images to understand colors, materials, and styles.

Matching wardrobe items to the user’s mood, event, or weather.

Suggesting new items when the current wardrobe doesn’t meet a need.

Reducing the time a user might spend planning outfits or browsing online stores.

Without the AI component, the app would be nothing more than an image uploader. The AI is what transforms it into a functional style assistant.

File Structure

Only the recently added files (today’s uploads) relate to this project. Older files (approx 2 months ago) in the repository are unrelated previous assignments (I could not figure out how to make a new repository).

index.tsx, App.tsx: Main interface and logic

components/: UI components

services/: Handles calls to the Gemini API

package.json: Project configuration

README.md: Documentation

