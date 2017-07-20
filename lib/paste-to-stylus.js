'use babel';

import PasteToStylusView from './paste-to-stylus-view';
import { CompositeDisposable } from 'atom';

export default {

  pasteToStylusView: null,
  modalPanel: null,
  subscriptions: null,

  // パッケージ起動時の処理
  activate(state) {
    this.pasteToStylusView = new PasteToStylusView(state.pasteToStylusViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.pasteToStylusView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'paste-to-stylus:toggle': () => this.toggle()
    }));
  },

  // パッケージ終了時に実行される処理
  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.pasteToStylusView.destroy();
  },

  // パッケージの次回起動時に状態を保存しておく処理
  serialize() {
    return {
      pasteToStylusViewState: this.pasteToStylusView.serialize()
    };
  },

  // toggleコマンドの実際の処理
  toggle() {
    deleteUnnecessaryMark();
  }
};


// 選択範囲から「：」「；」を削除する
// コピーしたソースコードをstylusで利用する際に使用
function deleteUnnecessaryMark(){
  var editor = atom.workspace.getActiveTextEditor();
  var selectedText = editor.getSelectedText();

  // 「margin: 0 auto;」の様な：の前後にスペースがある場合はスペースを削除する
  if(selectedText.match(/:\s+/g)){
    selectedText = selectedText.replace(/:\s+/g,":");
  }
  // :をスペースに変換、セミコロンを削除
  var str = selectedText.replace(/:/g," ").replace(/;/g,"");
  // 選択範囲を書き換え
  editor.insertText(str);
}
