const express = require('express');
const faker = require('faker');
const {times} = require('lodash');
const cors = require('cors');

const app = express();

app.use(cors());

const generateFile = () => ({
    author: {
        avatar: faker.internet.avatar(),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    },
    name: faker.system.fileName(),
    type: faker.system.fileType(),
    ext: faker.system.fileExt(),
    semver: faker.system.semver(),
    createDate: faker.date.past()
});

const files = times(100, generateFile);

app.get('/api/files', (req, res) => {
    res.send({files});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);