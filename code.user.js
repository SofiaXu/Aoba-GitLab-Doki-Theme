// ==UserScript==
// @name         Aoba's GitLab Doki Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get Anime Girl in The GitLab Background!
// @author       Aoba xu
// @grant        none
// @run-at document-start
// ==/UserScript==

(function () {
    'use strict';
    var createOptions = function (list, selectedId) {
        let result = "";
        for (let i = 0; i < list.length; i++) result += `<option value="${i}"${selectedId === i ? " selected" : ""}>${list[i].title}</option>`;
        return result;
    }
    let baseTheme = `
html {
    overflow-y: auto;
}
body {
    bottom: 0;
    top: 0;
    position: fixed;
    left: 0;
    right: 0;
}
.right-sidebar,
.nav-sidebar {
    background: rgb(240, 240, 240, 0.6);
}
.layout-page {
    background: rgb(255, 255, 255, 0.8);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
.content-wrapper {
    overflow-y: auto;
    position: absolute;
    transition: padding-left 0.3s;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
@media (min-width: 576px) {
    .commits-container .diff-files-changed {
        top: 0;
    }
}
@media(min-width: 768px) {
    .page-with-contextual-sidebar > .content-wrapper {
        top: 0;
        bottom: 0;
        left: 0;
        padding-left: 48px;
        right: 0;
    }
    .diff-file .file-title.is-commit, .diff-file .file-title-flex-parent.is-commit {
        top: 65px;
    }
}
@media(min-width: 1200px) {
    .page-with-contextual-sidebar > .content-wrapper {
        top: 0;
        bottom: 0;
        left: 0;
        padding-left: 220px;
        right: 0;
    }
}
@media(min-width: 768px) {
    .page-with-icon-sidebar > .content-wrapper {
        top: 0;
        bottom: 0;
        left: 0;
        padding-left: 48px;
        right: 0;
    }
    .diff-file .file-title::before, .diff-file .file-title-flex-parent::before {
        display: none;
    }
}
.user-profile>.cover-block {
    background: rgb(250, 250, 250, 0.6);
}
.merge-request-tabs-holder, .epic-tabs-holder {
    top: 0;
}
`;
    var dokiThemeSaveKey = "gitlabDokiThemeParams";
    var params = {};
    let temp = localStorage.getItem(dokiThemeSaveKey);
    if (temp != null) {
        params = JSON.parse(temp);
    } else {
        params = {
            useBaseTheme: true,
            useAppendTheme: true,
            useAppendThemeIndex: 1,
            appendThemes: [{
                title: "Empty",
                backgroundImage: "",
                backgroundImageStyle: ``,
                appendTheme: "",
            }, {
                title: "Riddle Joker - Mayu",
                backgroundImage: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/1277930/1714c6da789726d84a6d274337048ab244a188e7.jpg",
                backgroundImageStyle: `    background-attachment: fixed;
    background-repeat: no-repeat;
    background-size: 110%;
    background-position: center 10%;`,
                appendTheme: "",
            }, {
                title: "9-nine- - Miyako",
                backgroundImage: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/976390/1e7cf23ab3e45969ab08dda063c2d730a39d6624.jpg",
                backgroundImageStyle: `    background-attachment: fixed;
    background-repeat: no-repeat;
    background-size: 110%;
    background-position: center 10%;`,
                appendTheme: "",
            }]
        }
        localStorage.setItem(dokiThemeSaveKey, JSON.stringify(params));
    }
    if (params.useBaseTheme === true) {
        let baseThemeStyleBlock = document.createElement("style");
        baseThemeStyleBlock.id = 'base-theme';
        baseThemeStyleBlock.innerText = baseTheme;
        document.head.appendChild(baseThemeStyleBlock);
        if (params.useAppendTheme === true
            && params.appendThemes !== undefined
            && params.appendThemes.length !== undefined
            && params.appendThemes.length > 0
            && params.useAppendThemeIndex !== undefined
            && params.useAppendThemeIndex < params.appendThemes.length
            && params.useAppendThemeIndex > -1) {
            let appendThemeStyleBlock = document.createElement("style");
            appendThemeStyleBlock.id = 'append-theme';
            if (params.appendThemes[params.useAppendThemeIndex].appendTheme !== undefined || params.appendThemes[params.useAppendThemeIndex].appendTheme !== null) {
                appendThemeStyleBlock.innerText += params.appendThemes[params.useAppendThemeIndex].appendTheme;
            }
            appendThemeStyleBlock.innerText += `
body {
    ${params.appendThemes[params.useAppendThemeIndex].backgroundImageStyle !== undefined ? params.appendThemes[params.useAppendThemeIndex].backgroundImageStyle : ""}
    ${params.appendThemes[params.useAppendThemeIndex].backgroundImage !== undefined ? "background-image: url('" + params.appendThemes[params.useAppendThemeIndex].backgroundImage + "')" : ""}
}
        `
            document.head.appendChild(appendThemeStyleBlock);
        }
    }
    if (window.location.pathname.startsWith("/-/profile/preferences")) {
        window.addEventListener('load', () => {
            let oldRow = document.querySelector("#profile-preferences-form > .row");
            let row = oldRow.cloneNode(true);
            row.children[0].children[0].innerText = "应用主题";
            row.children[0].id = "";
            row.children[0].children[1].innerText = "通过 CSS 来自定义应用程序的外观。";
            row.children[1].children[0].innerText = "";
            row.children[1].children[0].insertAdjacentHTML('afterbegin', `<div class="col"><div class="form-group form-check"><input class="form-check-input" type="checkbox"${params.useBaseTheme ? " checked" : ""} id="aoba-use-base-theme">
<label class="form-check-label" for="aoba-use-base-theme">启用本插件
</label></div><div class="form-group form-check"><input class="form-check-input" type="checkbox"${params.useAppendTheme ? " checked" : ""} id="aoba-use-append-theme">
<label class="form-check-label" for="aoba-use-base-theme">使用额外样式（开启额外样式才能使用背景）
</label></div>
<div class="form-group">
<label class="label-bold" for="aoba-append-theme-select">选择自定义主题
</label><select class="select2" id="aoba-append-theme-select">${createOptions(params.appendThemes, params.useAppendThemeIndex)}
</select>
<div class="form-text text-muted">
为应用程序选择自定义主题。
</div>
</div>
<div class="form-group">
<label class="label-bold" for="aoba-background-title">自定义样式标题</label>
<input class="form-control gl-form-input" type="text" value="${params.appendThemes[params.useAppendThemeIndex].title}" id="aoba-background-title">
</div><div class="form-group">
<label class="label-bold" for="aoba-background-image-url">背景图片链接</label>
<input class="form-control gl-form-input" type="text" value="${params.appendThemes[params.useAppendThemeIndex].backgroundImage}" id="aoba-background-image-url">
<div class="form-text text-muted">
必须为链接
</div>
</div><div class="form-group">
<label class="label-bold" for="aoba-background-image-style">背景图片自定义样式</label>
<textarea class="form-control gl-form-input" rows="5" id="aoba-background-image-style">${params.appendThemes[params.useAppendThemeIndex].backgroundImageStyle}</textarea>
<div class="form-text text-muted">
必须为 CSS 背景属性（background-*）
</div>
</div><div class="form-group">
<label class="label-bold" for="aoba-background-append-style">额外自定义样式</label>
<textarea class="form-control gl-form-input" rows="5" id="aoba-background-append-style">${params.appendThemes[params.useAppendThemeIndex].appendTheme}</textarea>
<div class="form-text text-muted">
必须为 CSS 文件内容
</div>
</div></div>`);
            row.children[1].insertAdjacentHTML('beforeend', `<div class="row"><div class="col"><button id="aoba-theme-save" type="button" class="btn btn-confirm btn-md gl-button"><span class="gl-button-text">
      保存修改
    </span></button></div><div class="col"><button id="aoba-theme-save-new" type="button" class="btn btn-confirm btn-md gl-button"><span class="gl-button-text">
      保存为新主题
    </span></button></div><div class="col"><button id="aoba-theme-delete" type="button" class="btn btn-danger btn-md gl-button"><span class="gl-button-text">
      删除已选择主题
    </span></button></div><div class="col"><button id="aoba-theme-reset" type="button" class="btn btn-danger btn-md gl-button"><span class="gl-button-text">
      恢复初始主题
    </span></button></div></div>`);
            oldRow.parentElement.parentElement.insertBefore(row, oldRow.parentElement);
            let useBaseTheme = row.querySelector("#aoba-use-base-theme");
            let useAppendTheme = row.querySelector("#aoba-use-append-theme");
            let appendThemeSelect = row.querySelector("#aoba-append-theme-select");
            let backgroundTitle = row.querySelector("#aoba-background-title");
            let backgroundImageUrl = row.querySelector("#aoba-background-image-url");
            let backgroundImageStyle = row.querySelector("#aoba-background-image-style");
            let backgroundAppendStyle = row.querySelector("#aoba-background-append-style");
            let themeSave = row.querySelector("#aoba-theme-save");
            let themeSaveNew = row.querySelector("#aoba-theme-save-new");
            let themeDelete = row.querySelector("#aoba-theme-delete");
            let themeReset = row.querySelector("#aoba-theme-reset");
            appendThemeSelect.addEventListener("change", () => {
                params.useAppendThemeIndex = parseInt(appendThemeSelect.value.toString());
                backgroundTitle.value = params.appendThemes[params.useAppendThemeIndex].title;
                backgroundImageUrl.value = params.appendThemes[params.useAppendThemeIndex].backgroundImage;
                backgroundImageStyle.value = params.appendThemes[params.useAppendThemeIndex].backgroundImageStyle;
                backgroundAppendStyle.value = params.appendThemes[params.useAppendThemeIndex].appendTheme;
            });
            themeDelete.addEventListener("click", () => {
                if (params.appendThemes.length == 1) {
                    alert("你不能删除最后一个主题！");
                    return;
                }
                let index = parseInt(appendThemeSelect.value.toString());
                params.appendThemes.splice(index, 1);
                appendThemeSelect.children[index].remove();
                if (index === appendThemeSelect.children.length && index === params.useAppendThemeIndex) {
                    params.useAppendThemeIndex--;
                    index--;
                } else if (index === appendThemeSelect.children.length) {
                    index--;
                }
                appendThemeSelect.value = index.toString();
                backgroundTitle.value = params.appendThemes[index].title;
                backgroundImageUrl.value = params.appendThemes[index].backgroundImage;
                backgroundImageStyle.value = params.appendThemes[index].backgroundImageStyle;
                backgroundAppendStyle.value = params.appendThemes[index].appendTheme;
                localStorage.setItem(dokiThemeSaveKey, JSON.stringify(params));
                alert("删除成功！");
            });
            themeReset.addEventListener("click", () => {
                if (confirm("是否要进行重置？")) {
                    localStorage.removeItem(dokiThemeSaveKey);
                    alert("重置成功！");
                    location.reload();
                }
            })
            themeSaveNew.addEventListener("click", () => {
                let result = true;
                let resultText = "";
                let newAppendTheme = {
                    title: "",
                    backgroundImage: "",
                    backgroundImageStyle: ``,
                    appendTheme: "",
                }
                newAppendTheme.title = backgroundTitle.value;
                if (/^ {0,}$/.test(backgroundImageUrl.value)) {
                    newAppendTheme.backgroundImage = "";
                } else {
                    try {
                        new URL(backgroundImageUrl.value);
                        newAppendTheme.backgroundImage = backgroundImageUrl.value;
                    } catch (error) {
                        resultText += "链接格式不正确\n"
                        result = false;
                    }
                }
                if (/^( |\n){0,}$/.test(backgroundImageStyle.value) || backgroundImageStyle.value.split("\n").every(x => /^ {0,}background-?\w{0,}: {0,}(.+?); {0,}$/.test(x))) {
                    newAppendTheme.backgroundImageStyle = backgroundImageStyle.value
                } else {
                    result = false;
                    resultText += "背景属性 CSS 格式不正确\n";
                }
                newAppendTheme.appendTheme = backgroundAppendStyle.value;
                if (!result) {
                    alert(resultText);
                } else {
                    params.appendThemes.push(newAppendTheme);
                    localStorage.setItem(dokiThemeSaveKey, JSON.stringify(params));
                    appendThemeSelect.insertAdjacentHTML('beforeend', `<option value="${params.appendThemes.length - 1}">${newAppendTheme.title}</option>`)
                    appendThemeSelect.value = (params.appendThemes.length - 1).toString();
                    alert("添加成功！");
                }
            })
            themeSave.addEventListener("click", () => {
                let result = true;
                let resultText = "";
                let newAppendTheme = {
                    title: "",
                    backgroundImage: "",
                    backgroundImageStyle: ``,
                    appendTheme: "",
                }
                let index = parseInt(appendThemeSelect.value.toString());
                newAppendTheme.title = backgroundTitle.value;
                if (/^ {0,}$/.test(backgroundImageUrl.value)) {
                    newAppendTheme.backgroundImage = "";
                } else {
                    try {
                        new URL(backgroundImageUrl.value);
                        newAppendTheme.backgroundImage = backgroundImageUrl.value;
                    } catch (error) {
                        resultText += "链接格式不正确\n"
                        result = false;
                    }
                }
                if (/^( |\n){0,}$/.test(backgroundImageStyle.value) || backgroundImageStyle.value.split("\n").every(x => /^( {0,}background-?\w{0,}: {0,}(.+?); {0,}| {0,})$/.test(x))) {
                    newAppendTheme.backgroundImageStyle = backgroundImageStyle.value
                } else {
                    result = false;
                    resultText += "背景属性 CSS 格式不正确\n";
                }
                newAppendTheme.appendTheme = backgroundAppendStyle.value;
                if (!result) {
                    alert(resultText);
                } else {
                    params.useBaseTheme = useBaseTheme.checked;
                    params.useAppendTheme = useAppendTheme.checked;
                    params.useAppendThemeIndex = index;
                    params.appendThemes[params.useAppendThemeIndex] = newAppendTheme;
                    localStorage.setItem(dokiThemeSaveKey, JSON.stringify(params));
                    alert("保存成功！");
                    location.reload();
                }
            })
        })
    }
})();
