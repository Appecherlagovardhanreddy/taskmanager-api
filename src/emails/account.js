const sgMail = require('@sendgrid/mail')
const api_key = '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'
// sendgrid api key 

sgMail.setApiKey(api_key)

sgMail.send({
    to: 'govardhanr193@gmail.com',
    from : 'govardhanr531@gmail.com',
    subject : 'This is first Email',
    text :'I hope thi one actually reach to you . Cheers !.'
})