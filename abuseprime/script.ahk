#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

arr := ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "z", "x", "c", "v", "b", "n", "m", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]

F9::
sendinput {Y}
sendinput {a}
sendinput {s}
sendinput {Y}
sendinput {a}

Random, oVar, 1, 34						
sendinput % arr[oVar]
Random, oVar, 1, 34						
sendinput % arr[oVar]
Random, oVar, 1, 34						
sendinput % arr[oVar]
Random, oVar, 1, 34						
sendinput % arr[oVar]
Random, oVar, 1, 34						
sendinput % arr[oVar]
Random, oVar, 1, 34						
sendinput % arr[oVar]
Random, oVar, 1, 34						
sendinput % arr[oVar]
Random, oVar, 1, 34						
sendinput % arr[oVar]

sendinput {Tab}

Random, oVar, 1, 34						
sendinput % arr[oVar]
Random, oVar, 1, 34						
sendinput % arr[oVar]
Random, oVar, 1, 34						
sendinput % arr[oVar]
Random, oVar, 1, 34						
sendinput % arr[oVar]
Random, oVar, 1, 34						
sendinput % arr[oVar]
Random, oVar, 1, 34						
sendinput % arr[oVar]
Random, oVar, 1, 34						
sendinput % arr[oVar]
Random, oVar, 1, 34						
sendinput % arr[oVar]

sendinput {Tab}
sendinput {Down}
sendinput {Down}
sendinput {Down}

sendinput {Tab}
sendinput {Down}
sendinput {Down}
sendinput {Down}

sendinput {Tab}
sendinput {Down}
sendinput {Down}
sendinput {Down}
sendinput {Down}
sendinput {Down}
sendinput {Down}
sendinput {Down}
sendinput {Down}
sendinput {Down}
sendinput {Down}
sendinput {Down}
sendinput {Down}
sendinput {Down}
sendinput {Down}
sendinput {Down}
sendinput {Down}
sendinput {Down}
sendinput {Down}

sendinput {Tab}
Random, oVar, 1, 34						
sendinput % arr[oVar]
Random, oVar, 1, 34						
sendinput % arr[oVar]
Random, oVar, 1, 34						
sendinput % arr[oVar]
Random, oVar, 1, 34						
sendinput % arr[oVar]
Random, oVar, 1, 34						
sendinput % arr[oVar]
Random, oVar, 1, 34						
sendinput % arr[oVar]
Random, oVar, 1, 34						
sendinput % arr[oVar]
Random, oVar, 1, 34						
sendinput % arr[oVar]
Random, oVar, 1, 34						
sendinput % arr[oVar]
Random, oVar, 1, 34						
sendinput % arr[oVar]

sendinput {@}
sendinput {g}
sendinput {m}
sendinput {a}
sendinput {i}
sendinput {l}
sendinput {.}
sendinput {c}
sendinput {n}

sendinput {Tab}
sendinput {Space}
return

F8::
SendInput ^v
sendinput {Tab}
sendinput {s}
sendinput {u}
sendinput {p}
sendinput {e}
sendinput {r}
sendinput {m}
sendinput {e}
sendinput {g}
sendinput {a}
sendinput {p}
sendinput {e}
sendinput {t}
sendinput {u}
sendinput {4}
sendinput {Tab}
sendinput {Tab}
sendinput {Space}

return

F7::
sendinput ^w
sleep, 1000
sendinput ^+n
sleep, 500
sendinput #{Left}
sleep, 100
sendinput #{Left}
sendinput {Alt D}
sendinput {F6}
sendinput {Enter}
return
