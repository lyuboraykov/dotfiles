local ret_status="%(?:%{$fg_bold[green]%}:%{$fg_bold[red]%}☭ %s)%{$reset_color%}"

PROMPT='${ret_status}%{$fg[cyan]%} %3~ %{$fg[white]%}$(git_prompt_info) %{$fg_bold[yellow]%}>> %{$reset_color%}'
RPROMPT='%{$fg[magenta]%}$(_git_last_commit_summary)$(_git_time_since_commit)%{$reset_color%}'

ZSH_THEME_GIT_PROMPT_PREFIX="git:(%{$fg[blue]%}"
ZSH_THEME_GIT_PROMPT_SUFFIX="%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_DIRTY="%{$fg[white]%})%{$fg[red]%}✗%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_CLEAN="%{$fg[white]%})%{$fg[green]%}✔%{$reset_color%}"

function _git_last_commit_summary() {
  # TODO: move the if from the both functions to a separate function
  if git rev-parse --git-dir > /dev/null 2>&1; then
    if [[ $(git log 2>&1 > /dev/null | grep -c "^fatal: bad default revision") == 0 ]]; then
      local last_commit_message="$(git log -1 --oneline)"
      echo "${last_commit_message:0:30}... | "
    fi
  fi  
  echo ''
}

function _git_time_since_commit() {
  if git rev-parse --git-dir > /dev/null 2>&1; then
    # Only proceed if there is actually a commit.
    if [[ $(git log 2>&1 > /dev/null | grep -c "^fatal: bad default revision") == 0 ]]; then
      # Get the last commit.
      last_commit=$(git log --pretty=format:'%at' -1 2> /dev/null)
      now=$(date +%s)
      seconds_since_last_commit=$((now-last_commit))

      # Totals
      minutes=$((seconds_since_last_commit / 60))
      hours=$((seconds_since_last_commit/3600))

      # Sub-hours and sub-minutes
      days=$((seconds_since_last_commit / 86400))
      sub_hours=$((hours % 24))
      sub_minutes=$((minutes % 60))

      if [ $hours -gt 24 ]; then
          commit_age="${days}d"
      elif [ $minutes -gt 60 ]; then
          commit_age="${sub_hours}h${sub_minutes}m"
      else
          commit_age="${minutes}m"
      fi

      color=$ZSH_THEME_GIT_TIME_SINCE_COMMIT_NEUTRAL
      echo "$color$commit_age%{$reset_color%}"
    fi
  fi
}

