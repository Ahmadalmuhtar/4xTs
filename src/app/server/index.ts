'use server'

import nodemailer from 'nodemailer'
import { PrismaClient } from '@prisma/client'

type SendEmailInput = {
  name: string
  email: string
  company?: string
  phone: string
  message: string
  budget: string
}

const prisma = new PrismaClient()

const transporter = nodemailer.createTransport({
  host: 'mail.privateemail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function submitRequestAndSendEmail(payload: SendEmailInput) {
  try {
    await prisma.projectRequests.create({
      data: {
        name: payload.name,
        email: payload.email,
        company: payload.company,
        phone: payload.phone,
        message: payload.message,
        budget: payload.budget,
      },
    })
    const info = await transporter.sendMail({
      from: 'Your 3xTs <hello@3xts.com>', // sender address
      to: payload.email, // list of receivers
      subject: 'Thank you for contacting us', // Subject line
      html: '<b>Whatever</b>', // html body
    })

    console.log('Message sent: %s', info.messageId)
  } catch (error) {
    console.log('Error: ', error)
  }
}
