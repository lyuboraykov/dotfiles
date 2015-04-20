# Path to your oh-my-zsh installation.
export ZSH=$HOME/.oh-my-zsh

#don't run if called from a login shell
[ -z "$PS1" ] && return

echo "Don't panic!"

ZSH_THEME="lraykov"

plugins=(git common-aliases debian python)

source $ZSH/oh-my-zsh.sh

export PATH="/opt/stackato:/usr/lib/vm-jdk/bin:/usr/lib/maven/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/build/apps/bin"
export BUILDAPPSROOT=/build/apps
export BUILDAPPS=$BUILDAPPSROOT/bin
export MAVEN_OPTS="-Xmx2048m -XX:MaxPermSize=512m"
export JAVA_HOME="/usr/lib/vm-jdk"
export TOMCAT='/opt/tomcat'
export TCROOT='/build/toolchain'

export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin

alias jenkins="ssh -oStrictHostKeyChecking=no -oUserKnownHostsFile=/dev/null root@vcac-jenkins"
alias ack=ack-grep
alias python=python3

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
