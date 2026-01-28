import OpenAI from "openai";
import fs from "fs";
import process from "process";
import readline from "readline/promises";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// GPT Parameters
const verbosity = "low";
const reasoning = "high";

// Moral Scenario
const action = [
    {
        scenario:
            "Upset that his pizza order arrived late, a man hits the pizza delivery boy in the nose.",
    },
    {
        scenario:
            "Hoping to get money for drugs, a man follows a passerby to an alley and holds him at gunpoint",
    },
    {
        scenario:
            "Wondering whether he could get away with it, a man sets fire to a local liquor store",
    },
    {
        scenario:
            "Stricken by opportunity, a man charges his groceries to a credit card that he found.",
    },
    {
        scenario:
            "Irritated by a noisy neighborhood dog, a neighbor shoots the dog with an arrow. ",
    },
    {
        scenario:
            "At his mother’s funeral, a man wears a t-shirt and shorts although everyone else is in formalwear.",
    },
    {
        scenario:
            "Late for a meeting with his boss, a man eats his microwave lunch in his boss's office",
    },
    {
        scenario:
            "Instead of going to the dressing rooms, a man tries on dress shirts in the center of the department store.",
    },
    {
        scenario:
            "Just to push his limits, a man wears a colorful skirt to the office for everyone else to see. ",
    },
    {
        scenario:
            "After going all day without a meal, a man goes to a restaurant and eats his dinner with his fingers. ",
    },
];

// Select Moral Scenario
let index = 10; // 1-10
let repeat = 1;

// Word count for each scenario
const word_count_gpt4 = [72, 58, 70, 58, 60, 79, 81, 74, 64, 66];
const word_count_human = [41, 47, 35, 58, 100, 98, 86, 47, 52, 46];

const word_count_gpt5 = [61, 59, 54, 58, 48, 65, 57, 51, 62, 57];

const word_count_gpt5_avg =
    word_count_gpt5.reduce((a, b) => a + b, 0) / word_count_gpt5.length;

const word_count_gpt4_avg =
    word_count_gpt4.reduce((a, b) => a + b, 0) / word_count_gpt4.length;

console.log(`GPT-4 average word count: ${word_count_gpt4_avg}`);
console.log(`GPT-5 average word count: ${word_count_gpt5_avg}`);

// Content Save

const output = `output/passage-gen/gpt-5-1-wc-human/${index}.txt`;

// File system initialise
fs.writeFileSync(output, "Output:\n\n", "utf8");

// Response API call
for (let i = 0; i < repeat; i++) {
    console.log(`${i + 1} / ${repeat} in progress`);
    const response = await client.responses.create({
        model: "gpt-5.1",
        // model: "gpt-4",
        input: `Instructions: 
                    In this task, you will be given a hypothetical scenario. Your job is to make judgments
                    about whether or not the actor's action is morally wrong. Then you will answer various
                    questions about the action.
                    Scenario: "${action[index - 1].scenario}"
                    Please explain in a few sentences why this act is or is not wrong in your opinion. Please
                    answer the question as directly as possible. Please limit your answer to a maximum of
                    600 characters including spaces. 
                    Restrict your answer to exactly ${
                        word_count_human[index - 1]
                    } words. 
                    `,
        text: {
            verbosity: verbosity,
        },
        reasoning: {
            effort: reasoning,
        },
        // max_output_tokens: 700,
        // GPT-4
        // temperature: 0,
    });

    if (response && response.output_text) {
        let answer = response.output_text.trim();
        console.log(response);
        console.log(`${answer}\n`);
        // print word count
        const answer_word_count = answer.split(" ").length;
        console.log(`Word count: ${answer_word_count}\n`);

        fs.appendFileSync(output, `${i} : ${answer}\n\n`, "utf8");
    } else {
        console.log("Error: No RESPONSE.");
        // print error console
        console.error(response);
    }
}
