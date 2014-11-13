;;beginning of the Wizard's Apprentice Game

(defun square (x) 
  (* x x))

;; TODO is this function needed
;; takes two points and gives a new point which is the sum of the original points'
;; components
;; TODO this isnt working...come back to it!
;; (defun combine-two-points (p q combiner)
;;   (cons (combiner (car p) (car q)) 
;;             (combiner (cdr p) (cdr q))))
;; (defun add-two-points (p q)
;;   (combine-two-points p q (lambda (x y) (+ x y))))
;; (defun subtract-two-points (p q)
;;   (combine-two-points p q (lambda (x y) (- x y))))

(defun add-two-points (p q)
  (cons (+ (car p) (car q)) 
            (+ (cdr p) (cdr q))))

;; helps to shift 
(defun subtract-two-points (p q)
  (cons (- (car p) (car q)) 
            (- (cdr p) (cdr q))))

(defun distance-between-two-points (p q) 
  (sqrt (+ (square (- (car p) (car q))) (square (- (cdr p) (cdr q))))))

(defun generate-angle (point distance) 
  (acos (/ point distance)))

;; tested
(defun cartesian-point-to-polar-point (p) 
  (cons (distance-between-two-points p (cons 0 0))
            (generate-angle (car p) (distance-between-two-points p (cons 0 0)))))

;; (defun round-to (number precision &optional (what #'round))
;;     (let ((div (expt 10 precision)))
;;          (/ (funcall what (* number div)) div)))

(defun polar-point-to-cartesian-point (p) 
  (cons (* (car p) (cos (cdr p)))
            (* (car p) (sin (cdr p)))))

(defun shift-polar-point-by-angle (p angle) 
  (cons (car cartesian-point-to-polar-point (p)) ;; distance between points
            (+ (cdr cartesian-point-to-polar-point (p)) angle)))

;; p - cartesian point -> cartesian point
(defun generate-above-point (p) 
  (polar-point-to-cartesian-point
   (shift-polar-point-by-angle (cartesian-point-to-polar-point p) (/ pi 2))))
(defun generate-below-point (p)
  (polar-point-to-cartesian-point
   (shift-polar-point-by-angle (cartesian-point-to-polar-point p) (/ (* -1 pi) 2))))
