# Path to your oh-my-zsh installation.
export ZSH=$HOME/.oh-my-zsh

#don't run if called from a login shell
export GOPATH=$HOME/gocode
export PATH=$PATH:/bin
export PATH=$PATH:$GOPATH/bin
export JAVA_HOME=$(/usr/libexec/java_home)
export PATH=$(brew --prefix)/sbin:$(brew --prefix)/bin:$PATH:$HOME/bin:$GOPATH/bin

echo "Don't panic!"

ZSH_THEME="lraykov"

plugins=(git python)

export LC_CTYPE=en_US.UTF-8
export LC_ALL=en_US.UTF-8

source $ZSH/oh-my-zsh.sh

alias postgres="pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log start"
alias uuid='python -c "import uuid; print uuid.uuid4()"'
alias cerberus='cerberus --no-status-page'

# Execute command in cerberus (i.e. like on adhoc)
function crc() {
    cerberus --run-command "$*"
}

# Check if I haven't forgotten to encrypt 42
if [[ -f ~/42.plain ]]; then
  echo "WARNING: 42 is unencrypted!"
fi

42() {
  if [[ -f ~/42.enc ]]; then
    decrypt_42
  else
    encrypt_42
  fi    
}

encrypt_42() {
  local encryptOutput=$(openssl aes-256-cbc -in ~/42.plain -out ~/42.enc 2>&1)
  if [[ $encryptOutput == *"bad password read"* ]]; then
    echo "The passwords don't match."
    rm -f ~/42.enc
  else
    rm -f ~/42.plain
  fi
}

decrypt_42() {
  decryptOutput=$(openssl aes-256-cbc -d -in ~/42.enc -out ~/42.plain 2>&1)
  # Don't delete the encoded file if the password is wrong
  if [[ $decryptOutput == *"bad decrypt"* ]]; then
    echo "The decryption password is invalid."
    rm -f ~/42.plain
  else
    rm -f ~/42.enc
  fi
}

# added by newengsetup
export EDITOR=vim
export UBER_HOME="$HOME/Uber"
export UBER_OWNER="raykovl@uber.com"
export UBER_LDAP_UID="raykovl"
export VAGRANT_DEFAULT_PROVIDER=aws

path+=(/Users/raykovl/bin)

[ -s "/usr/local/bin/virtualenvwrapper.sh" ] && . /usr/local/bin/virtualenvwrapper.sh
[ -s "$HOME/.nvm/nvm.sh" ] && . $HOME/.nvm/nvm.sh
if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi

cdsync () {
    cd $(boxer sync_dir $@)
}
editsync () {
    $EDITOR $(boxer sync_dir $@)
}
opensync () {
    open $(boxer sync_dir $@)
}


free-port() { kill "$(lsof -t -i :$1)"; }

kill-port() { kill -kill "$(lsof -t -i :$1)"; }

export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting

test -e "${HOME}/.iterm2_shell_integration.zsh" && source "${HOME}/.iterm2_shell_integration.zsh"

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
