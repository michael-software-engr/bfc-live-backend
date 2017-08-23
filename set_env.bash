
set_env() {
  local dotenv="$(dirname "$BASH_SOURCE")/.env"

  local line=''
  declare -a env=()
  while read line; do
    if /bin/grep TWITTER_ <<<"$line" >/dev/null; then
      local key="$(cut -f 1 -d '=' <<<"$line")"
      local value="$(cut -f 2 -d '=' <<<"$line" | sed "s/'//g")"

      env+=( $key=$value )
    fi
  done <"$dotenv"

  heroku config:set ${env[@]}
}

set_env "$@"
