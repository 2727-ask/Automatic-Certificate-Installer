const express = require('express');
const multer = require('multer');
const fs = require('fs');
const app = express();
const upload = multer({ dest: 'uploads/' });
const { exec } = require('child_process');


// Endpoint for file upload
app.post('/upload', upload.single('file'), (req, res) => {
    // Access the uploaded file via req.file
    const file = req.file;

    if (!file) {
        return res.status(400).send('No file uploaded');
    }

    console.log(file.path);

    const tempFilePath = './temp.cer';

    fs.readFile(file.path, (err, data) => {
        if (err) {
            return res.status(500).send('Error reading certificate file');
        }
        console.log("data ", data);
        fs.writeFileSync(tempFilePath, data);
    })

    // Install the certificate using PowerShell command
    const command = `Import-Certificate -FilePath "${tempFilePath}" -CertStoreLocation Cert:\\LocalMachine\\Root`;
    exec(`powershell -Command "${command}"`, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error installing certificate');
        }

        // Clean up the temporary file
        fs.unlinkSync(tempFilePath);

        return res.send('Certificate installed successfully');
    });

});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
