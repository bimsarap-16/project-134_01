import fs from 'fs';
import path from 'path';

function walk(dir, files = []) {
    for (let file of fs.readdirSync(dir)) {
        let full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) walk(full, files);
        else if (full.match(/\.(css|jsx?|html)$/)) files.push(full);
    }
    return files;
}

const files = walk('d:\\sliit\\y3\\QuizBank 2\\Frontend\\src');
files.push('d:\\sliit\\y3\\QuizBank 2\\Frontend\\index.html');

for (let file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf-8');
    let orig = content;

    content = content.replace(/"'Calibri', sans-serif"'Calibri', sans-serif"/g, '"\'Calibri\', sans-serif"');

    if (content !== orig) {
        fs.writeFileSync(file, content);
        console.log('Fixed:', file);
    }
}
console.log('done');
