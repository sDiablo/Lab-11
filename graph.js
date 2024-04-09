const fs = require('fs');
const readline = require('readline');

// Функція для читання графа з файлу та визначення найкоротших відстаней між усіма парами вершин
function floydWarshall(inputFilePath) {
    const graph = [];

    // Читаємо граф з файлу
    const data = fs.readFileSync(inputFilePath, 'utf8');
    const lines = data.trim().split('\n');
    const n = parseInt(lines[0]);

    // Ініціалізуємо матрицю суміжності та заповнюємо її даними з файлу
    for (let i = 0; i < n; i++) {
        graph[i] = lines[i + 1].split(' ').map(Number);
    }

    // Алгоритм Флойда-Уоршелла
    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (graph[i][k] + graph[k][j] < graph[i][j]) {
                    graph[i][j] = graph[i][k] + graph[k][j];
                }
            }
        }
    }

    return graph;
}

// Функція для виведення матриці на екран або у файл
function printMatrix(matrix) {
    matrix.forEach(row => console.log(row.join(' ')));
}

// Функція для виведення найкоротшого шляху між вершинами
function shortestPath(graph, start, end) {
    const n = graph.length;
    if (start < 0 || start >= n || end < 0 || end >= n) {
        console.log("Invalid start or end vertex.");
        return;
    }

    const path = [start];
    while (start !== end) {
        let nextVertex = -1;
        let minDist = Infinity;
        for (let i = 0; i < n; i++) {
            if (graph[start][i] + graph[i][end] === graph[start][end] && graph[start][i] < minDist) {
                nextVertex = i;
                minDist = graph[start][i];
            }
        }
        if (nextVertex === -1) {
            console.log("There is no path between the specified vertices.");
            return;
        }
        path.push(nextVertex);
        start = nextVertex;
    }
    return path;
}

// Функція для введення вершин користувачем
async function inputVertices() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question("Enter start vertex: ", startVertex => {
            rl.question("Enter end vertex: ", endVertex => {
                rl.close();
                resolve({ start: parseInt(startVertex), end: parseInt(endVertex) });
            });
        });
    });
}

// Основна функція
async function main() {
    const inputFilePath = './input.txt';
    const outputMatrix = floydWarshall(inputFilePath);
    console.log("Shortest distances matrix:");
    printMatrix(outputMatrix);

    const { start, end } = await inputVertices();
    const shortestPathVertices = shortestPath(outputMatrix, start, end);
    if (shortestPathVertices) {
        console.log("Shortest path between vertices:", shortestPathVertices.join(' -> '));
    }
}

// Виклик основної функції
main();
