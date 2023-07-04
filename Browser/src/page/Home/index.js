import React, { useState } from "react";
import { Card } from "antd";
import { Button, Input, Space, Spin, Alert } from "antd";

const BASE_URL = "http://localhost:3500";

export default function Home() {
  const [password, setpassword] = useState("");
  const [resultPassword, setresultPassword] = useState("");
  const [ArrayInputs, setArrayInputs] = useState("");
  const [difference, setArrayDifference] = useState("");
  const [Loader, setLoader] = useState(false);

  const Save = (type) => {
    setLoader(true);

    let output = 0;
    let nums = ArrayInputs.split(",").map(Number);
    if (type === "Program1") {
      output = minimumStepsToMakePasswordStrong(password);
      setresultPassword(output);
    } else {
      if (nums.length % 2 === 0) {
        output = minimumDifference(nums);
        setArrayDifference(output);
      } else {
        setArrayDifference("Input length is incorrect");
      }
    }
    const data = {
      type: type,
      input: type === "Program1" ? password : JSON.stringify(nums),
      output: type === "Program1" ? resultPassword : difference,
    };
    SaveDB(data);
  };

  const SaveDB = async (data) => {
    let headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
    };

    let bodyContent = JSON.stringify(data);
    await fetch(`${BASE_URL}/saveResults`, {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    })
      .then((data) => data.json())
      .then((res) => console.log(res))
      .catch((error) => console.log(error))
      .finally(() => setLoader(false));
  };

  function minimumDifference(nums) {
    const n = nums.length / 2;
    const totalSum = nums.reduce((sum, num) => sum + num, 0);
    const targetSum = Math.floor(totalSum / 2);

    const dp = [];
    for (let i = 0; i <= n; i++) {
      dp.push(new Array(targetSum + 1).fill(false));
    }
    dp[0][0] = true;

    for (const num of nums) {
      for (let i = n; i > 0; i--) {
        for (let s = targetSum; s >= num; s--) {
          dp[i][s] = dp[i][s] || dp[i - 1][s - num];
        }
      }
    }

    for (let s = targetSum; s >= 0; s--) {
      if (dp[n][s]) {
        return totalSum - 2 * s;
      }
    }
  }

  function minimumStepsToMakePasswordStrong(password) {
    if (isPasswordStrong(password)) {
      return 0;
    }

    let steps = 0;

    if (password.length < 6) {
      steps += 6 - password.length;
    } else if (password.length > 20) {
      steps += password.length - 20;
    }

    if (!containsLowercaseLetter(password)) {
      steps++;
    }
    if (!containsUppercaseLetter(password)) {
      steps++;
    }
    if (!containsDigit(password)) {
      steps++;
    }

    for (let i = 0; i < password.length - 2; i++) {
      if (password[i] === password[i + 1] && password[i] === password[i + 2]) {
        steps++;
        break;
      }
    }
    return steps;
  }

  function isPasswordStrong(password) {
    return (
      password.length >= 6 &&
      password.length <= 20 &&
      containsLowercaseLetter(password) &&
      containsUppercaseLetter(password) &&
      containsDigit(password) &&
      !hasThreeRepeatingCharacters(password)
    );
  }

  function containsLowercaseLetter(password) {
    return /[a-z]/.test(password);
  }

  function containsUppercaseLetter(password) {
    return /[A-Z]/.test(password);
  }

  function containsDigit(password) {
    return /[0-9]/.test(password);
  }

  function hasThreeRepeatingCharacters(password) {
    for (let i = 0; i < password.length - 2; i++) {
      if (password[i] === password[i + 1] && password[i] === password[i + 2]) {
        return true;
      }
    }
    return false;
  }

  return (
    <div className="home">
      {Loader && (
        <Space
          direction="vertical"
          style={{
            width: "100%",
          }}
        >
          <Spin tip="Loading...">
            <Alert message="Saving to DB" type="info" />
          </Spin>
        </Space>
      )}

      <Card title="Problem #1 - Check Password Strength" className="card">
        <div className="password-description">
          1. A password is considered strong if the below conditions are all
          met:
          <ul>
            <li>It has at least 6 characters and at most 20 characters.</li>
            <li>
              It contains at least one lowercase letter, at least one uppercase
              letter, and at least one digit.
            </li>
            <li>
              It does not contain three repeating characters in a row (i.e.,
              "Baaabb0" is weak, but "Baaba0" is strong).
            </li>
          </ul>
          Given a string password, return the minimum number of steps required
          to make the password strong. If the password is already strong, return
          0.
        </div>
        <Space.Compact style={style.alignCenter}>
          <Input
            onChange={(e) => setpassword(e.target.value)}
            placeholder="Enter Password"
          />
          <Button onClick={() => Save("Program1")} type="primary">
            Check Strength
          </Button>
        </Space.Compact>
        <div className="steps-container">
          <span>Response:</span>
          <span>
            {resultPassword === 0 ? "Your Password is Strong" : resultPassword}
          </span>
        </div>
      </Card>
      <Card title="Problem #2 - Array Partition" className="card">
        <div className="array-description">
          2. You are given an integer array nums of 2 * n integers. You need to
          partition nums into two arrays of length n to minimize the absolute
          difference of the sums of the arrays. To partition nums, put each
          element of nums into one of the two arrays. Return the minimum
          possible absolute difference.
          <div>Example:</div>
          <ul>
            <li>Input: nums = [1,2,3,4]</li>
            <li>Output: 0</li>
            <li>
              Explanation: One optimal partition is: [1,4] and [2,3]. The
              absolute difference between the sums of the arrays is abs((5) -
              (5)) = 0.
            </li>
          </ul>
        </div>
        <Space.Compact style={style.alignCenter}>
          <Input
            onChange={(e) => setArrayInputs(e.target.value)}
            placeholder="Enter Elements for the Array Eg:1,2,3,4,5,6,7 "
          />
          <Button onClick={() => Save("Program2")} type="primary">
            Provide Difference{" "}
          </Button>
        </Space.Compact>
        <div className="steps-container">
          <span>Response:</span>
          <span>{difference}</span>
        </div>
      </Card>
    </div>
  );
}

const style = {
  alignCenter: {
    padding: "10px",
    width: "100%",
  },
};
