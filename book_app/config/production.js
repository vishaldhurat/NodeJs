// production configuration

module.exports = {
    environment: 'production',
    server: {
        hostName: '', //Need production URL
        port: 8888
    },
    dbConfig: {
        connectionLimit: 200, //important
        host: 'us-cdbr-iron-east-03.cleardb.net',
        user: 'bb2b92cc3f57ef',
        password: '9cbf99a0',
        database: 'heroku_862e36cb50be6ef',
        debug: false
    },
    log: {
        name: 'bookie',
        path: 'bookie.log',
        consoleLevel: 'debug',
        fileLevel: 'trace',
        backups: 3
    },
    textLocal: {
        host: "http://api.textlocal.in/send?",
        email: "sharad.is.biradar@gmail.com",
        apiKey: "6PYTszR+5+8-MV53IxiyISlLvX484Kl3Ial7FUTeQN"
    },
    emailList: {
        fromEmail: "sharad.is.biradar@gmail.com",
        toEmail: "suvarnadjagtap@gmail.com, sharad.is.biradar@gmail.com, hanmanthpatil@gmail.com"
    },
    smtp: {
        host: 'smtp.gmail.com',
        port: 465,
        secureConnection: false,
        auth: {
            user: 'sharad.is.biradar@gmail.com',
            pass: '123@1234'
        }
    },
    jwt: {
        secret: '2d034746-1g04-1a4h-4b5g-34f5g8h803r8'
    }
};
