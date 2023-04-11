import { Reporter, Suite, FullResult, TestCase, TestResult, FullConfig } from '@playwright/test/reporter';
const fs = require('fs');
const path = require('path');

class TestReporter implements Reporter {
    onBegin(config: FullConfig, suite: Suite) {
        console.log(`Starting the run with ${suite.allTests().length} tests`);
    }

    onTestBegin(test: TestCase) {
        console.log(`Starting test ${test.title}`);
    }

    onTestEnd(test: TestCase, result: TestResult) {
        const data = `${test.title}: ${result.status} ${result.duration}\n`;
        fs.appendFile(path.join(__dirname, '../App/reports/testruns.txt'), data, function(err) {
            if (err) throw err;
        });
    }

    onEnd(result: FullResult) {
        console.log(`Finished the run: ${result.status}`);
    }
    
}

export default TestReporter;
