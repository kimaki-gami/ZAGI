/* =========================================================
   ZAGI MVP - 無料占いをしていると……
   ---------------------------------------------------------
   このファイルは「画面の切り替え」と「体験の進行」を担当します。
   実際のメール送信・決済・外部APIは一切行いません。
   ========================================================= */

// =========================================================
// 1. 基本データ
// =========================================================

const scenarioData = {
    title: "無料占いをしていると……",
    user: {
        nickname: "",
        birthday: "",
        consultation: "",
        email: ""
    },
    credentials: {
        username: "KIMAKI001",
        password: "ZAGI1234"
    },
    points: 75,
    currentDay: 1,
    selectedFeelings: {},
    finalAction: "",
    routeLog: [],
    stoppedEarly: false
};

const dayData = {
    1: {
        title: "本日の鑑定結果",
        summary: "まずは、あなたの相談内容をもとにした鑑定が届いています。",
        body: `
            <p>○○様、このたびは無料鑑定をご利用いただきありがとうございます。</p>
            <p>今回いただいたご相談をもとに、今月の金運を見てみました。</p>
            <div class="quote">「今月は、今まで見えていなかった可能性に気づく時期になりそうです。」</div>
            <p>まずは焦らず、身の回りの小さな変化を大切にして過ごしてください。</p>
            <p>また気になることがあれば、いつでもご相談ください。</p>
        `,
        feelingPrompt: "この時点で、どう感じましたか？",
        feelings: ["普通に丁寧だと思った", "少し期待した", "まだよく分からない", "少し怪しい"]
    },
    2: {
        title: "昨日のご相談について",
        summary: "昨日の鑑定に続いて、相談への返信が届きました。",
        body: `
            <p>○○様、昨日の鑑定結果について、その後いかがでしたか？</p>
            <p>「これからのお金について知りたい」というご相談が気になっていました。</p>
            <div class="quote">「無理に何かを変えなくても大丈夫です。気になることがあれば、こちらで一緒に整理していきましょう。」</div>
            <p>占いとは別に、普段の生活についてのお話でも構いません。何でもお気軽にお送りください。</p>
        `,
        feelings: ["親身だと思った", "自分のことを見てくれている気がした", "まだ警戒している", "特に何も感じない"]
    },
    3: {
        title: "○○様について、もう一度見てみました",
        summary: "あなたのこれまでの相談を踏まえたメッセージが届きました。",
        body: `
            <p>○○様のこれまでのご相談を改めて見てみました。</p>
            <p>やはり、少し珍しい金運の傾向が出ています。</p>
            <div class="quote">「一般的な鑑定では見落とされやすい、独特な流れをお持ちのようです。」</div>
            <p>この傾向は、今後大きな転機につながる可能性があります。</p>
            <p>もう少し詳しく見ていくことで、今後の過ごし方も分かってくるかもしれません。</p>
        `,
        feelings: ["特別だと思った", "少し気になった", "おだてられている気がした", "特に何も感じない"]
    },
    4: {
        title: "○○様にだけ、お伝えしておきたいこと",
        summary: "少し特別な内容を含むメッセージが届いています。",
        body: `
            <p>実は、ここから先の内容はあまり他の方にはお伝えしていません。</p>
            <div class="quote">「今回の鑑定内容は、できれば他の方には見せないでください。」</div>
            <p>せっかく積み重ねてきた運気の流れが、他の人に話すことで弱くなってしまう可能性があります。</p>
            <p>○○様だけにお伝えしている内容ですので、大切にしまっておいてください。</p>
        `,
        feelingPrompt: "このメッセージを見たとき、どう感じましたか？",
        feelings: ["本当に特別なのかもと思った", "秘密と言われると少し気になる", "相談しづらいと思った", "怪しいと感じた"]
    },
    5: {
        title: "実際に運気が変わった方のお話",
        summary: "鑑定を受けた人の成功例が紹介されています。",
        body: `
            <p>○○様と似たようなお悩みをお持ちだった方の例をご紹介します。</p>
            <div class="success-story">
                <div class="fake-bank-statement" aria-label="架空の残高イメージ">
                    <div class="statement-head"><span>架空銀行</span><span>残高照会</span></div>
                    <div class="statement-row"><span>開始時</span><strong>¥1,024</strong></div>
                    <div class="statement-row"><span>鑑定後</span><strong>¥100,001,024</strong></div>
                </div>
            </div>
            <p>この方も、最初は「本当に変わるのか」と半信半疑だったそうです。</p>
            <div class="quote">「一歩踏み出したことで、流れが大きく変わりました。」</div>
            <p>○○様にも、同じような可能性があるかもしれません。</p>
        `,
        feelings: ["本当に効果があるのかもと思った", "うますぎる話だと思った", "証拠があって少し信じた", "まだ怪しいと思った"]
    },
    6: {
        title: "今、大きな変化が近づいています",
        summary: "これまでの鑑定をまとめたメッセージが届いています。",
        body: `
            <p>これまでの流れを総合してみると、今はかなり重要な時期に入っています。</p>
            <p>ここ数日のうちに、運気の流れが変わる可能性があります。</p>
            <div class="quote">「せっかくここまで来たので、もう少し詳しく見てみることをおすすめします。」</div>
            <p>今やめてしまうと、せっかくの機会を逃してしまうかもしれません。</p>
            <p>必要なときは、いつでもご相談ください。</p>
        `,
        feelings: ["ここまで来たなら続けたいと思った", "少し焦った", "もったいないと感じた", "怪しいと感じた"]
    },
    7: {
        title: "○○様だけに、特別なご案内があります",
        summary: "7日間の鑑定を終え、特別なサービスの案内が届きました。",
        body: `
            <p>○○様、これまで7日間の鑑定をご利用いただきありがとうございました。</p>
            <p>ここまで拝見してきた中で、○○様には通常の鑑定とは別のご案内ができると判断しました。</p>
            <div class="quote">「この機会を逃さないでください。今だけ、特別な条件をご用意しています。」</div>
            <p>詳しい内容は、このメールの案内からご確認ください。</p>
        `,
        feelingPrompt: "特別価格の案内を見たとき、どう感じましたか？",
        feelings: ["お得そうだと思った", "ちょっと気になった", "急かされていると感じた", "怪しいと感じた"]
    }
};

const dangerPoints = [
    {
        title: "「無料」という入口",
        body: "無料サービスに見せることで、最初の警戒心を下げていました。無料であることだけでは、安全性の証明にはなりません。"
    },
    {
        title: "あなた向けに見せる",
        body: "名前や相談内容を使って、自分専用のサービスだと感じやすい形にしていました。"
    },
    {
        title: "毎日連絡して信頼を作る",
        body: "最初から金銭を要求せず、丁寧な鑑定や相談を繰り返して、関係ができたように見せていました。"
    },
    {
        title: "特別扱いと秘密",
        body: "「あなただけ」「他の人には話さないで」と伝えることで、特別感を作り、外部への相談をしにくくしていました。"
    },
    {
        title: "成功例を見せる",
        body: "架空の成功例を使って、「本当に効果があるのかもしれない」と思わせる材料にしていました。"
    },
    {
        title: "ここまで続けたことを利用する",
        body: "数日間の鑑定ややり取りがあることで、「せっかくここまで続けたのだから」という気持ちが生まれやすくなります。"
    },
    {
        title: "限定・期限・値引き",
        body: "通常価格と限定価格を並べ、時間制限をつけることで、落ち着いて判断する時間を減らそうとしていました。"
    },
    {
        title: "少額のポイント購入",
        body: "一度に大きな支払いを求めるだけでなく、少額のポイント購入も用意していました。「少しだけなら」と支払いやすくするためです。"
    }
];

// =========================================================
// 2. DOM取得
// =========================================================

const screens = document.querySelectorAll("[data-exp-page]");
const homeScreen = document.getElementById("homeScreen");
const experienceScreen = document.getElementById("experienceScreen");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalCloseButton = document.getElementById("modalCloseButton");

// =========================================================
// 3. 画面管理
// =========================================================

function showHome() {
    homeScreen.hidden = false;
    experienceScreen.hidden = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function showExperiencePage(pageId) {
    homeScreen.hidden = true;
    experienceScreen.hidden = false;

    screens.forEach((screen) => {
        screen.hidden = screen.id !== pageId;
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function showModal(title, html) {
    modalTitle.textContent = title;
    modalBody.innerHTML = html;
    modal.hidden = false;
}

function closeModal() {
    modal.hidden = true;
}

// =========================================================
// 4. ルート記録
// =========================================================

function logRoute(label, detail = "") {
    scenarioData.routeLog.push({
        label,
        detail,
        day: scenarioData.currentDay
    });
}

function resetScenario() {
    scenarioData.user = {
        nickname: "",
        birthday: "",
        consultation: "",
        email: ""
    };
    scenarioData.points = 75;
    scenarioData.currentDay = 1;
    scenarioData.selectedFeelings = {};
    scenarioData.finalAction = "";
    scenarioData.routeLog = [];
    scenarioData.stoppedEarly = false;
}

// =========================================================
// 5. HOME
// =========================================================

document.getElementById("startExperience").addEventListener("click", () => {
    resetScenario();
    showExperiencePage("expIntro");
});

document.getElementById("beginScenarioButton").addEventListener("click", () => {
    logRoute("体験開始", "普通の占いサイトへ");
    showExperiencePage("fortunePortal");
});

document.getElementById("backHomeFromIntro").addEventListener("click", showHome);
document.getElementById("homeButton").addEventListener("click", showHome);

document.getElementById("guideButton").addEventListener("click", () => {
    showModal(
        "ZAGIの使い方",
        `
            <p><strong>この体験では、わざと騙されて大丈夫です。</strong></p>
            <p>体験中に「正解・失敗」の判定はありません。途中で止まっても、その先を確認できます。</p>
            <p>入力は体験用の架空情報だけにしてください。実際のメール送信や決済は行いません。</p>
        `
    );
});

document.getElementById("homeGuideButton").addEventListener("click", () => {
    document.getElementById("guideButton").click();
});

document.getElementById("modeButton").addEventListener("click", () => {
    showModal(
        "授業モード",
        `
            <p><strong>授業モード（準備中の簡易表示）</strong></p>
            <p>この体験は、詐欺の名称を覚えるのではなく、「気づく・止まる・確かめる」を振り返る教材として利用できます。</p>
            <p>目安：体験 約10分／振り返りを含めた授業 20〜30分程度を想定しています。</p>
        `
    );
});

document.getElementById("homeModeButton").addEventListener("click", () => {
    document.getElementById("modeButton").click();
});

// =========================================================
// 6. 普通の占いサイト
// =========================================================

document.querySelectorAll(".portal-dummy-link").forEach((button) => {
    button.addEventListener("click", () => {
        showModal(
            "このコンテンツについて",
            `<p>このページは普通の占いサイトに見えるように作られた体験用コンテンツです。</p><p>今回の体験では、このリンクの先は作り込まれていません。</p>`
        );
    });
});

document.getElementById("dummyMenuButton").addEventListener("click", () => {
    showModal(
        "メニュー",
        `<p>メニューを開きました。</p><p>ここも体験では必要な範囲だけ再現しています。</p>`
    );
});

document.querySelectorAll(".zodiac-button").forEach((button) => {
    button.addEventListener("click", () => {
        const zodiac = button.dataset.zodiac;
        const result = document.getElementById("zodiacResult");
        result.innerHTML = `<strong>${zodiac}の今日の運勢</strong><p>今日は新しいことに挑戦するのに向いている日。思いがけないところから良い知らせが届くかもしれません。</p>`;
        result.hidden = false;
        logRoute("普通の占いを見た", zodiac);
    });
});

document.getElementById("fortuneAdButton").addEventListener("click", () => {
    logRoute("占いサイト内の広告をクリック", "無料金運鑑定へ");
    showExperiencePage("freeFortune");
});

// =========================================================
// 7. 無料鑑定フォーム
// =========================================================

document.getElementById("fortuneForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    scenarioData.user.nickname = formData.get("nickname");
    scenarioData.user.birthday = formData.get("birthday");
    scenarioData.user.consultation = formData.get("consultation");
    scenarioData.user.email = formData.get("email");

    logRoute("無料鑑定に申し込んだ", "入力内容は外部へ送信されない");

    document.getElementById("incomingMailNotice").hidden = true;
    showExperiencePage("applicationReceived");

    window.setTimeout(() => {
        document.getElementById("incomingMailNotice").hidden = false;
    }, 700);
});

document.getElementById("openFirstMailButton").addEventListener("click", () => {
    showExperiencePage("inbox");
    renderInbox();
});

// =========================================================
// 8. メール
// =========================================================

function buildMails() {
    const nickname = scenarioData.user.nickname || "○○";

    return [
        {
            id: "welcome",
            day: 0,
            title: "無料鑑定結果のお知らせ",
            preview: `${nickname}様の鑑定について、専用ページをご用意しました。`,
            body: `
                <p>${nickname}様</p>
                <p>このたびは無料鑑定をご利用いただき、ありがとうございます。</p>
                <p>今回のご相談を拝見したところ、もう少し詳しく確認したいポイントが見つかりました。</p>
                <p>専用ページでは、毎日の鑑定結果や相談への返信をご覧いただけます。</p>
                <div class="mail-credentials">
                    <div><span>ユーザー名</span><strong>${scenarioData.credentials.username}</strong></div>
                    <div><span>パスワード</span><strong>${scenarioData.credentials.password}</strong></div>
                </div>
            `,
            buttonText: "専用ページへ進む"
        },
        {
            id: "day1",
            day: 1,
            title: "本日の鑑定結果",
            preview: "まずは、あなたの金運について鑑定しました。"
        },
        {
            id: "day2",
            day: 2,
            title: "昨日のご相談について",
            preview: "昨日のご相談について、少し気になっていました。"
        },
        {
            id: "day3",
            day: 3,
            title: "○○様について、もう一度見てみました",
            preview: "少し珍しい金運の傾向が出ています。"
        },
        {
            id: "day4",
            day: 4,
            title: "○○様にだけ、お伝えしておきたいこと",
            preview: "他の方にはあまりお伝えしていない内容です。"
        },
        {
            id: "day5",
            day: 5,
            title: "実際に運気が変わった方のお話",
            preview: "鑑定を受けた方の成功例をご紹介します。"
        },
        {
            id: "day6",
            day: 6,
            title: "今、大きな変化が近づいています",
            preview: "これまでの鑑定を総合してみました。"
        },
        {
            id: "day7",
            day: 7,
            title: "○○様だけに、特別なご案内があります",
            preview: "7日間の鑑定を終え、特別な条件をご用意しました。"
        }
    ];
}

function renderInbox() {
    const mailList = document.getElementById("mailList");
    const mails = buildMails();

    mailList.innerHTML = "";

    mails.forEach((mail) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = `mail-item ${mail.day <= scenarioData.currentDay ? "unread" : ""}`;
        item.innerHTML = `
            <div>
                <p class="mail-item-title">${mail.title}</p>
                <p class="mail-item-meta">開運の扉　${mail.day === 0 ? "最初のメール" : `DAY ${mail.day}`}<br>${mail.preview || ""}</p>
            </div>
            <span class="mail-item-tag">${mail.day === 0 ? "重要" : `DAY ${mail.day}`}</span>
        `;

        item.addEventListener("click", () => {
            openMail(mail.id);
        });

        mailList.appendChild(item);
    });
}

function openMail(mailId) {
    const mail = buildMails().find((item) => item.id === mailId);

    if (!mail) return;

    if (mail.day > scenarioData.currentDay) {
        showModal(
            "まだ届いていません",
            `<p>このメールはシミュレーション上、もう少し先の日に届く予定です。</p>`
        );
        return;
    }

    const content = document.getElementById("mailDetailContent");

    if (mail.id === "welcome") {
        content.innerHTML = `
            <div class="mail-detail-header">
                <h2>${mail.title}</h2>
                <p>送信者：開運の扉</p>
            </div>
            <div class="mail-body">${mail.body}</div>
            <button id="openLoginFromMail" class="primary-button" type="button">専用ページへ進む</button>
        `;

        document.getElementById("openLoginFromMail").addEventListener("click", () => {
            logRoute("返信メールを確認", "体験用ユーザー名・パスワードを受け取った");
            showExperiencePage("loginScreen");
        });
    } else {
        content.innerHTML = `
            <div class="mail-detail-header">
                <h2>${mail.title}</h2>
                <p>送信者：開運の扉　／　DAY ${mail.day}</p>
            </div>
            <div class="mail-body">${dayData[mail.day].body}</div>
            <button id="openDashboardFromDayMail" class="primary-button" type="button">開運の扉を見る</button>
        `;

        document.getElementById("openDashboardFromDayMail").addEventListener("click", () => {
            logRoute(`DAY ${mail.day} のメールを読んだ`, mail.title);
            showExperiencePage("serviceDashboard");
            updateDashboard();
        });
    }

    showExperiencePage("mailDetail");
}

document.getElementById("backToInboxButton").addEventListener("click", () => {
    showExperiencePage("inbox");
    renderInbox();
});

document.getElementById("inboxToHomeButton").addEventListener("click", () => {
    showExperiencePage("serviceDashboard");
    updateDashboard();
});

// =========================================================
// 9. ログイン
// =========================================================

document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.getElementById("loginUser").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (username !== scenarioData.credentials.username || password !== scenarioData.credentials.password) {
        showModal(
            "ログイン情報を確認してください",
            `<p>メールに届いた体験用のユーザー名とパスワードをそのまま入力してください。</p>`
        );
        return;
    }

    logRoute("開運サイトへログイン", "体験用アカウントを使用");
    showExperiencePage("serviceDashboard");
    updateDashboard();
});

// =========================================================
// 10. ダッシュボード / DAY進行
// =========================================================

function updateDashboard() {
    const day = scenarioData.currentDay;
    const data = dayData[day];

    document.getElementById("pointsDisplay").textContent = scenarioData.points;
    document.getElementById("dayDisplay").textContent = day;
    document.getElementById("dashboardSummary").textContent = data.summary;
    document.getElementById("dashboardMailCount").textContent = `DAY ${day} の新しいメッセージがあります`;
    document.getElementById("dayProgressFill").style.width = `${(day / 7) * 100}%`;
}

document.getElementById("openCurrentDayButton").addEventListener("click", () => {
    renderCurrentDayMessage();
});

document.getElementById("dashboardInboxButton").addEventListener("click", () => {
    showExperiencePage("inbox");
    renderInbox();
});

document.getElementById("pointsPurchaseButton").addEventListener("click", () => {
    document.getElementById("pointsPurchaseCurrent").textContent = scenarioData.points;
    logRoute("ポイント購入画面を見た", "少額ポイント購入の導線");
    showExperiencePage("pointsPurchase");
});

document.getElementById("stopExperienceButton").addEventListener("click", () => {
    scenarioData.stoppedEarly = true;
    logRoute(`DAY ${scenarioData.currentDay} で体験を止める選択をした`);
    showExperiencePage("stopChoice");
});

function renderCurrentDayMessage() {
    const day = scenarioData.currentDay;
    const data = dayData[day];

    document.getElementById("messageDayLabel").textContent = day;
    document.getElementById("dayMessageTitle").textContent = data.title;
    document.getElementById("dayMessageBody").innerHTML = data.body;

    const feelingCheck = document.getElementById("feelingCheck");
    const feelingOptions = document.getElementById("feelingOptions");

    if (data.feelings) {
        feelingCheck.hidden = false;
        feelingOptions.innerHTML = "";

        data.feelings.forEach((feeling) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "choice-button";
            button.textContent = feeling;

            if (scenarioData.selectedFeelings[day] === feeling) {
                button.classList.add("selected");
            }

            button.addEventListener("click", () => {
                scenarioData.selectedFeelings[day] = feeling;
                feelingOptions.querySelectorAll(".choice-button").forEach((item) => item.classList.remove("selected"));
                button.classList.add("selected");
            });

            feelingOptions.appendChild(button);
        });
    } else {
        feelingCheck.hidden = true;
    }

    if (day === 7) {
        document.getElementById("nextDayButton").textContent = "特別な案内を見る";
    } else {
        document.getElementById("nextDayButton").textContent = "次の日へ";
    }

    showExperiencePage("dailyMessage");
}

document.getElementById("skipFeelingButton").addEventListener("click", () => {
    document.getElementById("feelingCheck").hidden = true;
});

document.getElementById("nextDayButton").addEventListener("click", () => {
    const currentDay = scenarioData.currentDay;
    logRoute(`DAY ${currentDay} の鑑定を体験`, dayData[currentDay].title);

    if (currentDay >= 7) {
        logRoute("7日間の鑑定を完了", "特別価格案内へ");
        document.getElementById("offerUserName").textContent = `${scenarioData.user.nickname || "○○"}様`;
        showExperiencePage("specialOffer");
        return;
    }

    scenarioData.currentDay += 1;
    updateDashboard();
    renderCurrentDayMessage();
});

document.getElementById("stopFromDayButton").addEventListener("click", () => {
    scenarioData.stoppedEarly = true;
    logRoute(`DAY ${scenarioData.currentDay} で体験を止めた`);
    showExperiencePage("stopChoice");
});

// =========================================================
// 11. 特別価格 / ポイント / 決済
// =========================================================

document.getElementById("specialPurchaseButton").addEventListener("click", () => {
    logRoute("特別鑑定の購入を選択", "3,000円");
    prepareCheckout("特別鑑定チケット", 3000, "specialOffer");
});

document.getElementById("offerPointsButton").addEventListener("click", () => {
    logRoute("ポイント購入を選択", "少額購入の導線");
    document.getElementById("pointsPurchaseCurrent").textContent = scenarioData.points;
    showExperiencePage("pointsPurchase");
});

document.getElementById("declineOfferButton").addEventListener("click", () => {
    scenarioData.stoppedEarly = true;
    logRoute("特別価格を今回はやめた");
    showExperiencePage("stopChoice");
});

document.querySelectorAll(".point-package").forEach((button) => {
    button.addEventListener("click", () => {
        const points = Number(button.dataset.points);
        const price = Number(button.dataset.price);
        logRoute(`ポイント購入 ${points}pt を選択`, `${price.toLocaleString("ja-JP")}円`);
        prepareCheckout(`${points}pt ポイント購入`, price, "pointsPurchase");
    });
});

function prepareCheckout(title, price, returnPage) {
    document.getElementById("checkoutTitle").textContent = title;
    document.getElementById("checkoutPrice").textContent = `${price.toLocaleString("ja-JP")}円`;
    document.getElementById("checkout").dataset.returnPage = returnPage;
    document.getElementById("checkout").dataset.price = String(price);
    document.getElementById("checkout").dataset.title = title;
    showExperiencePage("checkout");
}

document.querySelectorAll(".payment-method").forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".payment-method").forEach((item) => item.classList.remove("selected"));
        button.classList.add("selected");
    });
});

document.getElementById("backToCheckoutSourceButton").addEventListener("click", () => {
    const returnPage = document.getElementById("checkout").dataset.returnPage || "specialOffer";
    showExperiencePage(returnPage);
});

document.getElementById("confirmPurchaseButton").addEventListener("click", () => {
    logRoute("購入を確定しようとした", "実際の決済は発生しない");
    showExperiencePage("experienceFinished");
});

// =========================================================
// 12. 途中で止まった場合
// =========================================================

document.getElementById("finishNowButton").addEventListener("click", () => {
    logRoute("ここで体験終了を選択");
    showExperiencePage("experienceFinished");
});

document.getElementById("seeWhatHappensButton").addEventListener("click", () => {
    logRoute("この先に何が起きるか確認することを選択");
    renderContinuationPreview();
    showExperiencePage("continuationPreview");
});

function renderContinuationPreview() {
    const currentDay = scenarioData.currentDay;
    const container = document.getElementById("continuationContent");

    const items = [];

    for (let day = currentDay + 1; day <= 7; day += 1) {
        items.push({
            title: `DAY ${day}`,
            text: dayData[day].summary
        });
    }

    items.push({ title: "特別価格", text: "通常10,000円 → あなた限定3,000円。期限付きの案内が表示されます。" });
    items.push({ title: "ポイント購入", text: "3,000円の案内とは別に、少額のポイント購入ルートも用意されています。" });
    items.push({ title: "支払い", text: "購入を確定する直前まで進める設計になっています。" });

    if (items.length === 0) {
        container.innerHTML = `<p>この先に追加の体験はありません。振り返りへ進みましょう。</p>`;
        return;
    }

    container.innerHTML = items.map((item) => `
        <div class="preview-step">
            <strong>${item.title}</strong>
            <span>${item.text}</span>
        </div>
    `).join("");
}

document.getElementById("finishAfterContinuationButton").addEventListener("click", () => {
    showExperiencePage("experienceFinished");
});

// =========================================================
// 13. 振り返り
// =========================================================

document.getElementById("startReflectionButton").addEventListener("click", () => {
    renderRouteTimeline();
    showExperiencePage("reflectionRoute");
});

function renderRouteTimeline() {
    const routeTimeline = document.getElementById("routeTimeline");

    const baseRoute = scenarioData.routeLog.length > 0
        ? scenarioData.routeLog
        : [{ label: "体験を開始した", detail: "ルート情報はありません" }];

    routeTimeline.innerHTML = baseRoute.map((item) => `
        <div class="timeline-item">
            <strong>${item.label}</strong>
            ${item.detail ? `<p>${item.detail}</p>` : ""}
        </div>
    `).join("");
}

document.getElementById("toDangerPointsButton").addEventListener("click", () => {
    renderDangerPoints();
    showExperiencePage("reflectionDanger");
});

function renderDangerPoints() {
    const container = document.getElementById("dangerPointList");

    container.innerHTML = dangerPoints.map((item) => `
        <article class="danger-item">
            <h2>${item.title}</h2>
            <p>${item.body}</p>
        </article>
    `).join("");
}

document.getElementById("toAwarenessButton").addEventListener("click", () => {
    renderReflectionSummary();
    renderFinalActionChoices();
    showExperiencePage("reflectionAwareness");
});

function renderReflectionSummary() {
    const container = document.getElementById("reflectionAnswersSummary");
    const labels = {
        1: "DAY 1で感じたこと",
        4: "DAY 4で感じたこと",
        7: "DAY 7で感じたこと"
    };

    const lines = Object.keys(labels).map((day) => {
        const answer = scenarioData.selectedFeelings[day];
        return `
            <div class="answer-line">
                <span>${labels[day]}</span>
                <strong>${answer || "回答なし"}</strong>
            </div>
        `;
    });

    container.innerHTML = `
        <h2>体験中に残したメモ</h2>
        ${lines.join("")}
        <p class="hint-text">これは点数や合否ではありません。自分の感じ方の変化を振り返るための記録です。</p>
    `;
}

function renderFinalActionChoices() {
    const container = document.getElementById("finalActionChoices");
    const choices = [
        "公式サイトなど別の経路から調べる",
        "家族・先生などに相談する",
        "いったん支払いを止める",
        "メールの案内だけを信じて進める"
    ];

    container.innerHTML = "";

    choices.forEach((choice) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "choice-button";
        button.textContent = choice;

        if (scenarioData.finalAction === choice) {
            button.classList.add("selected");
        }

        button.addEventListener("click", () => {
            scenarioData.finalAction = choice;
            container.querySelectorAll(".choice-button").forEach((item) => item.classList.remove("selected"));
            button.classList.add("selected");
        });

        container.appendChild(button);
    });
}

document.getElementById("toAlternativeButton").addEventListener("click", () => {
    logRoute("振り返りを行った", `現実なら：${scenarioData.finalAction || "未選択"}`);
    renderAlternativeRoute();
    showExperiencePage("reflectionAlternative");
});

function renderAlternativeRoute() {
    const container = document.getElementById("alternativeRouteList");

    const alternativeSteps = [
        "怪しいと感じたら、その場で操作を止める",
        "メールに書かれたリンクだけでなく、公式サイトなど別の経路から確認する",
        "一人で判断せず、信頼できる人に相談する",
        "支払いを急かされても、時間を置いて考える",
        "「無料」「あなただけ」「今だけ」などの言葉だけで安全だと判断しない"
    ];

    container.innerHTML = alternativeSteps.map((step, index) => `
        <div class="preview-step">
            <strong>${index + 1}. ${step}</strong>
            <span>${index < 2 ? "ここで体験を止めても、詐欺の先にある流れを知ることはできます。" : "これは、現実のネット利用でも役立つ確認方法です。"}</span>
        </div>
    `).join("");
}

document.getElementById("backHomeAfterReflectionButton").addEventListener("click", showHome);

// =========================================================
// 14. モーダル
// =========================================================

modalCloseButton.addEventListener("click", closeModal);

document.querySelector(".modal-backdrop").addEventListener("click", closeModal);

document.getElementById("footerContactButton").addEventListener("click", () => {
    showModal(
        "お問い合わせ",
        `
            <p>お問い合わせフォームは今後追加予定です。</p>
            <p>現時点ではMVPの体験を優先して制作しています。</p>
        `
    );
});

// =========================================================
// 15. 初期状態
// =========================================================

showHome();
