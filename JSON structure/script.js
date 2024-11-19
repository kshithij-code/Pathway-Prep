document.addEventListener('DOMContentLoaded', () => {
    const jsonData = {
        init_1_in: {
            interest: ["Coding", "Math", "Design"],
            resume: "./path/to/resume",
            portfolio: "www.xyz.com"
        },
        init_1_out: {
            questions: {
                "Question 1": ["Option 1", "Option 2", "Option 3", "Option 4"],
                "Question 2": ["Option 1", "Option 2", "Option 3", "Option 4"],
                "Question 3": ["Option 1", "Option 2", "Option 3", "Option 4"]
            }
        },
        init_2_out: {
            categories: {
                coding: 30,
                aptitude: 10,
                domain: 10
            },
            area_of_impro: {},
            graph_data: {
                x: ["Coding", "Aptitude", "Domain"],
                y: [30, 10, 10]
            }
        }
    };

    // Render questionnaire
    const app = document.getElementById('app');
    const renderQuestions = () => {
        const questions = jsonData.init_1_out.questions;
        let questionHTML = '<h3>Questionnaire</h3>';
        Object.keys(questions).forEach((question, index) => {
            questionHTML += `<div>
                <h5>${question}</h5>
                ${questions[question].map(
                    (option) => `<label><input type="radio" name="q${index}" value="${option}"> ${option}</label><br>`
                ).join('')}
            </div>`;
        });
        app.innerHTML = questionHTML;

        // Add result summary
        renderSummary();
    };

    const renderSummary = () => {
        const categories = jsonData.init_2_out.categories;
        let summaryHTML = '<h3>Summary</h3><canvas id="categoryChart"></canvas>';
        app.innerHTML += summaryHTML;

        // Render graph
        const ctx = document.getElementById('categoryChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: jsonData.init_2_out.graph_data.x,
                datasets: [{
                    label: 'Scores',
                    data: jsonData.init_2_out.graph_data.y,
                    backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe'],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    renderQuestions();
});
