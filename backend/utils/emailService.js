import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // 'gmail', 'outlook', etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendConfirmationEmail = async (email, token) => {
  const confirmationUrl = `${process.env.FRONTEND_URL}/confirm-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Confirmation de votre compte',
    html: `
      <h1>Bienvenue sur notre plateforme !</h1>
      <p>Veuillez cliquer sur le lien suivant pour confirmer votre compte :</p>
      <a href="${confirmationUrl}">Confirmer mon compte</a>
      <p>Ce lien est valable pour 24 heures.</p>
    `
  };
  
  return transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    html: `
      <h1>Réinitialisation de mot de passe</h1>
      <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
      <p>Veuillez cliquer sur le lien suivant pour définir un nouveau mot de passe :</p>
      <a href="${resetUrl}">Réinitialiser mon mot de passe</a>
      <p>Ce lien est valable pour 1 heure.</p>
      <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
    `
  };
  
  return transporter.sendMail(mailOptions);
};