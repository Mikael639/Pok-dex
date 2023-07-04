for f in *.scp; do
    mv -- "$f" inst"${f#*p}"
done

