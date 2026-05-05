const fs = require('fs');
eval(fs.readFileSync('data.js', 'utf8'));

        function generateWrongOptions(correctAnswer, currentMode) {
            let wrongOptions = new Set();
            const isFormulaMode = currentMode === 'nameToFormula';
            const correctValue = isFormulaMode ? correctAnswer.formula : correctAnswer.name;
            const propertyToCompare = isFormulaMode ? 'formula' : 'name';

            // Tags que não indicam o elemento/família e devem ser ignoradas na busca por similaridade
            const ignoreTags = ['facil', 'medio', 'dificil', 'oxianion', 'monoatomico', 'poliatomico', 'forte', 'fraco', 'moderado', 'basico', 'acido', 'neutro', 'anfotero', 'misto', 'organico', 'hidrogenoanion'];
            const meaningfulTags = (correctAnswer.tags || []).filter(t => !ignoreTags.includes(t));

            // Nível 1: Mesmo tipo E compartilha uma tag de família (ex: 'haleto', 'enxofre')
            let level1 = compounds.filter(c => 
                c.type === correctAnswer.type && 
                c[propertyToCompare] !== correctValue &&
                (c.tags || []).some(t => meaningfulTags.includes(t))
            );

            // Nível 2: Mesmo tipo (mas sem tag em comum)
            let level2 = compounds.filter(c => 
                c.type === correctAnswer.type && 
                c[propertyToCompare] !== correctValue &&
                !level1.includes(c)
            );

            // Nível 3: Qualquer outro (fallback)
            let level3 = compounds.filter(c => 
                c[propertyToCompare] !== correctValue &&
                !level1.includes(c) && !level2.includes(c)
            );

            function pickRandom(pool, count) {
                let picked = [];
                let tempPool = [...pool];
                while (picked.length < count && tempPool.length > 0) {
                    const randomIndex = Math.floor(Math.random() * tempPool.length);
                    picked.push(tempPool.splice(randomIndex, 1)[0][propertyToCompare]);
                }
                return picked;
            }

            let options = pickRandom(level1, 3);
            if (options.length < 3) {
                options = options.concat(pickRandom(level2, 3 - options.length));
            }
            if (options.length < 3) {
                options = options.concat(pickRandom(level3, 3 - options.length));
            }

            options.forEach(opt => wrongOptions.add(opt));
            return Array.from(wrongOptions);
        }

for(let i=0; i<10; i++) {
    let currentMode = Math.random() < 0.5 ? 'formulaToName' : 'nameToFormula';
    let currentQuestion = compounds[Math.floor(Math.random() * compounds.length)];
    let correctAnswer = currentMode === 'formulaToName' ? currentQuestion.name : currentQuestion.formula;
    
    let wrongOptions = generateWrongOptions(currentQuestion, currentMode);
    let allOptions = [correctAnswer, ...wrongOptions];
    console.log('Mode:', currentMode);
    console.log('Question:', currentMode === 'formulaToName' ? currentQuestion.formula : currentQuestion.name);
    console.log('Correct Answer:', correctAnswer);
    console.log('All Options:', allOptions);
    console.log('---');
}
