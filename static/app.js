class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            Chatbox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, Chatbox, sendButton } = this.args;
    
        openButton.addEventListener('click', () => this.toggleState(Chatbox)); // Fix: Use Chatbox instead of chatBox
    
        sendButton.addEventListener('click', () => this.onSendButton(Chatbox)); // Fix: Use Chatbox instead of chatBox
    
        const node = Chatbox.querySelector('input'); // Fix: Use Chatbox instead of chatBox
        node.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                this.onSendButton(Chatbox); // Fix: Use Chatbox instead of chatBox
            }
        });
    }

    toggleState(chatBox) {
        this.state = !this.state;

        // show or hides the box
        if(this.state) {
            chatBox.classList.add('chatbox--active')
        }else {
            chatBox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1}
        this.messages.push(msg1);

        //http
        fetch($SCRIPT_ROOT + '/predict', {
            method: 'POST',
            body: JSON.stringify({message: text1}),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(r => r.json())
        .then(r => {
            let msg2 = {name: "Sam", message: r.answer };
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            textField.value = ''

        }).catch((error) => {
           console.error('Error:', error);
           this.updateChatText(chatbox)
           textField.value = '' 
        });
        
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Sam")
            {
                html += '<div class="messages__item messages__item--visitor">'+ item.message +'</div>'
            }else
            {
                html += '<div class="messages__item messages__item--operator">'+ item.message +'</div>' 
            }
        });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }

}

const chatbox = new Chatbox();
chatbox.display();