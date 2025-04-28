import { MathEquation } from '../types';

// Các loại phép tính có thể có
const OPERATORS = ['+', '-', '×', '÷'];

// Mapping độ khó vào loại câu hỏi
const difficultyToQuestionTypes: { [key: number]: number[] } = {
    1: [1, 3, 4, 5, 6],                  // Cộng/trừ nhỏ, nhân 10, chia đơn giản
    2: [1, 2, 3, 4, 5, 6, 7],             // Cộng/trừ 2 chữ số, chia, nhân đơn giản
    3: [2, 3, 4, 6, 7, 8, 9],             // Cộng/trừ lớn hơn, phép tính 3 số, nhân lớn
    4: [2, 3, 8, 9, 10, 11],              // Thêm ngoặc, chia kết hợp cộng
    5: [3, 8, 9, 10, 11, 12],             // Nhân lớn, chia + cộng/trừ, kết hợp nhân cộng
    6: [9, 10, 11, 12, 13, 14],           // Phép toán nhiều bước, nhân chia phức tạp hơn
    7: [10, 11, 12, 13, 14, 15],          // Nhân chia lớn hơn, phép cộng trừ thêm
    8: [12, 13, 14, 15, 16],              // Chia nhân liên tục, cộng trừ xen kẽ
    9: [13, 14, 15, 16, 17, 18],          // Bài toán nhiều bước liên tiếp, cần tư duy nhiều hơn
    10: [15, 16, 17, 18, 19],             // Toán nhiều bước (chia, nhân, cộng/trừ) phức tạp nhất
};


// Random integer từ min đến max (bao gồm)
const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Sinh 1 câu hỏi theo loại
const generateQuestionByType = (qType: number): { equation: string[], answer: number } => {
    let question = '';
    let answer = 0;

    const pickOp = () => (Math.random() > 0.5 ? '+' : '-');

    switch (qType) {
        case 1: { // Câu hỏi cộng trừ 1 chữ số
            const a = getRandomInt(2, 9);
            const b = getRandomInt(0, a);
            const op = pickOp();
            question = `${a} ${op} ${b}`;
            answer = eval(`${a}${op}${b}`);
            break;
        }
        case 2: { // Câu hỏi cộng trừ 2 chữ số
            const a = getRandomInt(10, 99);
            const b = getRandomInt(10, a);
            const op = pickOp();
            question = `${a} ${op} ${b}`;
            answer = eval(`${a}${op}${b}`);
            break;
        }
        case 3: { // Câu hỏi nhân 1 chữ số
            const a = getRandomInt(1, 9);
            const b = getRandomInt(1, 9);
            const op = '*'
            question = `${a} ${op} ${b}`;
            answer = eval(`${a}${op}${b}`);
            break;
        }
        case 4: { // Câu hỏi chia 1 chữ số
            const b = getRandomInt(1, 5);
            let a = b * getRandomInt(1, 4);
            while (a % b !== 0) {
                a = b * getRandomInt(1, 9);
            }
            const op = '/';
            question = `${a} ${op} ${b}`;
            answer = eval(`${a}${op}${b}`);
            break;
        }
        case 5: { // Câu hỏi chia cho chính nó
            const a = getRandomInt(1, 9);
            question = `${a} / ${a}`;
            answer = 1;
            break;
        }
        case 6: { // Câu hỏi nhân 10
            const a = getRandomInt(1, 30);
            question = `${a} * 10`;
            answer = a * 10;
            break;
        }
        case 7: { // Câu hỏi chia chính nó cộng 1 sốsố
            const a = getRandomInt(1, 9);
            const b = getRandomInt(1, 99);
            question = `(${a} / ${a}) + ${b}`;
            answer = 1 + b;
            break;
        }
        case 8: { // Câu hỏi cộng trừ 3 số
            const a = getRandomInt(10, 99);
            const b = getRandomInt(1, 9);
            const c = getRandomInt(1, 9);
            const op1 = pickOp();
            const op2 = pickOp();
            question = `${a} ${op1} ${b} ${op2} ${c}`;
            answer = eval(`${a}${op1}${b}${op2}${c}`);
            break;
        }
        case 9: { // Câu hỏi nhân 2 chữ số với 1 chữ số
            const a = getRandomInt(10, 50);
            const b = getRandomInt(1, 9);
            question = `${a} * ${b}`;
            answer = a * b;
            break;
        }
        case 10: { // Câu hỏi nhân, chia cho cùng 1 số
            const a = getRandomInt(1, 9);
            const b = getRandomInt(10, 99);
            question = `(${b} * ${a}) / ${a}`;
            answer = b;
            break;
        }
        case 11: { // Câu hỏi chia, cộng với 1 số
            const b = getRandomInt(1, 9);
            const a = getRandomInt(1, 4) * b;
            const c = getRandomInt(10, 99);
            question = `(${a} / ${b}) + ${c}`;
            answer = (a / b) + c;
            break;
        }
        case 12: { // Câu hỏi nhân, cộng trừ với 1 số
            const a = getRandomInt(1, 9);
            const b = getRandomInt(1, 9);
            let c = getRandomInt(1, 99);
            const op = pickOp();
            if (op === '-' && a * b < c) {
                c = getRandomInt(1, a * b);
            }
            question = `(${a} * ${b}) ${op} ${c}`;
            answer = eval(`${a * b}${op}${c}`);
            break;
        }
        case 13: { // Câu hỏi chia, nhân với 1 số
            const b = getRandomInt(1, 9);
            const a = getRandomInt(1, 5) * b;
            const c = getRandomInt(1, 9);
            question = `(${a} / ${b}) * ${c}`;
            answer = (a / b) * c;
            break;
        }
        case 14: { // Câu hỏi chia 2 chữ số, cộng 1 số
            let a = getRandomInt(10, 30)
            let b = getRandomInt(1, 6) * a;
            while (b > 100) {
                a = getRandomInt(10, 30);
                b = getRandomInt(1, 5) * a;
            }
            const c = getRandomInt(10, 90);
            question = `(${a} / ${b}) + ${c}`;
            answer = (a / b) + c;
            break;
        }
        case 15: { // Câu hỏi nhân 2 chữ số, cộng trừ 2 chữ số
            const a = getRandomInt(1, 9);
            const b = getRandomInt(10, 99);
            let c = getRandomInt(10, 99);
            const op = pickOp();
            if (op === '-' && a * b < c) {
                c = getRandomInt(10, a * b);
            }
            question = `(${a} * ${b}) ${op} ${c}`;
            answer = eval(`${a * b}${op}${c}`);
            break;
        }
        case 16: { // Câu hỏi nhân 2 chữ số, chia 2 chữ số
            const a = getRandomInt(1, 9);
            const b = getRandomInt(10, 99);
            const c = getRandomInt(1, 9);
            question = `(${a} * ${b}) / ${c}`;
            answer = Math.floor((a * b) / c);
            break;
        }
        case 17: { // Câu hỏi chia 2 chữ số, cộng 2 chữ số
            let a = getRandomInt(10, 40);
            let b = getRandomInt(2, 6) * a;
            const c = getRandomInt(10, 99);
            question = `(${a} / ${b}) + ${c}`;
            answer = eval(`${a / b} + ${c}`);
            break;
        }
        case 18: { // Câu hỏi nhân 10, cộng 1 số
            const a = getRandomInt(10, 99);
            const c = getRandomInt(10, 99);
            const op = pickOp();
            question = `(${a} * 10) ${op} ${c}`;
            answer = eval(`${a * 10}${op}${c}`);
            break;
        }
        case 19: { // Câu hỏi chia chính nó nhân 1 số
            const a = getRandomInt(1, 9);
            const randomNum = getRandomInt(10, 99);
            question = `(${a} / ${a}) * ${randomNum}`;
            answer = randomNum;
            break;
        }
        default:
            throw new Error("Invalid question type");
    }

    const tokens = question.replace(/\(/g, '').replace(/\)/g, '').split(' ');
    return { equation: tokens, answer: Math.round(answer) };
};

// Sinh ra 1 phép tính cho level
export const generateEquation = (level: number): MathEquation => {
    const types = difficultyToQuestionTypes[level] || [1];
    const qType = types[getRandomInt(0, types.length - 1)];

    const { equation, answer } = generateQuestionByType(qType);

    const isCorrect = Math.random() > 0.5;
    const finalAnswer = isCorrect ? answer : answer + (Math.random() > 0.5 ? 1 : -1) * getRandomInt(1, 5);

    return {
        equation: [...equation, '=', finalAnswer.toString()],
        isCorrect
    };
};

/**
 * Sinh nhiều câu hỏi cho 1 level
 */
export const generateQuestionsForLevel = (level: number, count: number = 7): MathEquation[] => {
    const questions: MathEquation[] = [];
    for (let i = 0; i < count; i++) {
        questions.push(generateEquation(level));
    }
    return questions;
};

/**
 * Sinh ra 1 phép tính cho level hiện tại khi người chơi trả lời sai
 */
export const generateEquationForCurrentLevel = (level: number): MathEquation => {
    return generateEquation(level);
};
