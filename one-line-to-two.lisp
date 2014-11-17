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

(defun round-to (number precision &optional (what #'round))
    (let ((div (expt 10 precision)))
         (/ (funcall what (* number div)) div)))

;; tested - needs to round more correctly
(defun polar-point-to-cartesian-point (p) 
  (cons (* (car p) (cos (cdr p)))
            (* (car p) (sin (cdr p)))))

;; tested
(defun shift-polar-point-by-angle (p angle) 
  (cons (car  p) ;; distance between points
            (+ (cdr  p) angle)))

;; p - cartesian point -> cartesian point
(defun generate-above-point (p) 
  (polar-point-to-cartesian-point
   (shift-polar-point-by-angle (cartesian-point-to-polar-point p) (/ pi 2))))
(defun generate-below-point (p)
  (polar-point-to-cartesian-point
   (shift-polar-point-by-angle (cartesian-point-to-polar-point p) (/ (* -1 pi) 2))))

;; the below both take two points, and returns two new points, 
;; both shifted by pi/2 (-pi/2) from the original points
(defun points-to-above-points (p q)
  ;; shift points back to the origin
  (let ((above-point (generate-above-point (subtract-two-points p q))))
    (cons (add-two-points above-point p)
              (add-two-points above-point q))))

(defun points-to-below-points (p q)
  ;; shift points back to the origin
  (let ((below-point (generate-below-point (subtract-two-points p q))))
    (cons (add-two-points below-point p)
              (add-two-points below-point q))))

;; take a list of points and calculate the above/below points


(defun generate-above-line-helper (temp-list list)
  (if (endp (cdr list))
        temp-list
  (generate-above-line-helper 
    (cons temp-list (points-to-above-points (car list) (cadr list))) (cdr list))))