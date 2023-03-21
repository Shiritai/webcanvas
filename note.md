# Quick Note

## 新建 Git + node.js + Firebase + TypeScript 專案

[youtube](https://www.youtube.com/watch?v=06a5oydSC8E), [ref](https://www.digitalocean.com/community/tutorials/typescript-new-project)

以下所有操作都<font color=cd5c5c>**位於專案資料夾**</font>下。

### Step 1: (Optional) Git

請先確認安裝好 `git`，在終端機輸入 `git` 能正確識別，並建立好 Github 帳號。

* 建立遠端 repo

    開啟 Github，建立遠端 Repository 並設定必要資訊、記下連結。

* 本地
    * 初始化
        ```bash
        git init
        ```
    * 若專案資料夾下有其他資料，可能會想先 first commit 一下
        ```bash
        git add -A
        git commit -m "First commit to initialize repository"
        ```
    * 加入遠端 repository 並上傳
        ```bash
        git remote add origin <REPO_URL>
        git push -u origin BRANCH_NAME # BRANCH_NAME is mostly "master"
        ```

* (Optional) 至 Github 確認是否成功 push 上去

### Step 2: node.js

請先確認安裝好 `node.js`，在終端機輸入 `npm` 和 `npx` 都能正確識別。

* 初始化專案資料夾
    ```bash
    npm init
    ```
* (Optional, 搭配 Firebase) 安裝 firebase 套件
	```bash
	npm install -g --save-dev firebase-tools
	```

### Step 3: Firebase

請先確認完成 `node.js` 的設定。

* 確認已經申請並設定好遠端 Firebase
    * 建議都啟用開發模式
    * 可比如啟用以下功能
        * Authentication, 並啟用以 Google 帳號登錄
        * Realtime Hosting
        * Storage
* 本地操作
    * 登入 Firebase
        ```bash
        firebase login
        ```
		會透過瀏覽器登入驗證，若很久以前登入過且過很久，建議改用以下指令。
        ```bash
        firebase login --reauth
        ```
    * 初始化 Firebase 專案
        ```bash
        firebase init
        ```
		依照提示以空白鍵勾選設定遠端時啟用的功能，並設定專案細節。建議設定:
		* 若有使用 Realtime Hosting，則依照預設使用 `database.rules.json` 作為管理資料庫的設定檔
		* 多頁網站 (非 single page)
		* 不要初始化 git
    * 部署 Firebase
		```bash
		firebase deploy
		```
		此時會提示 Firebase 部署到的網站連結，可使用瀏覽器開啟該連結並確認結果。

### Step 4: TypeScript

請下載 TypeScript 編譯器，確認在終端機輸入 `npx` 和 `tsc` 都可被正確識別。

* 初始化 TypeScript 專案
	```bash
	npx tsc --init
	```
* 調整生成的 `tsconfig.json`，比如調整
    * `rootDir` 決定來源的 `.ts` 放在哪
    * `outDir` 決定生成的 `.js` 要放在哪
* 編譯
	設定好 `tsconfig.json` 後，編譯僅需簡單三字。
	```bash
	tsc
	```